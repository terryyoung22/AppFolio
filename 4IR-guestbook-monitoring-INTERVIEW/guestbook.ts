import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import * as cfg from "./config";

export const scrapeLabel = { "guestbook.monitoring/scrape": "true" };

const ns = new k8s.core.v1.Namespace("guestbook", {
    metadata: { name: cfg.guestbookNamespace },
});
export const namespace = ns.metadata.name;

const partOf = { "app.kubernetes.io/part-of": "guestbook" };

function redisExporter(): k8s.types.input.core.v1.Container {
    return {
        name: "redis-exporter",
        image: cfg.redisExporterImage,
        env: [{ name: "REDIS_ADDR", value: "redis://localhost:6379" }],
        ports: [{ name: "metrics", containerPort: 9121 }],
        resources: {
            requests: { cpu: "10m", memory: "16Mi" },
            limits: { memory: "64Mi" },
        },
        readinessProbe: { httpGet: { path: "/health", port: "metrics" }, periodSeconds: 10 },
    };
}

function metricsService(app: string, port: number, dependsOn: pulumi.Resource) {
    return new k8s.core.v1.Service(`${app}-metrics`, {
        metadata: {
            name: `${app}-metrics`,
            namespace,
            labels: { app, ...partOf, ...scrapeLabel },
        },
        spec: {
            type: "ClusterIP",
            selector: { app },
            ports: [{ name: "metrics", port, targetPort: "metrics" }],
        },
    }, { dependsOn });
}

//
// REDIS LEADER
//
const redisLeaderLabels = { app: "redis-leader" };
const redisLeaderDeployment = new k8s.apps.v1.Deployment("redis-leader", {
    metadata: { namespace, labels: { ...redisLeaderLabels, ...partOf } },
    spec: {
        selector: { matchLabels: redisLeaderLabels },
        template: {
            metadata: { labels: { ...redisLeaderLabels, ...partOf } },
            spec: {
                containers: [
                    {
                        name: "redis-leader",
                        image: "redis",
                        resources: { requests: { cpu: "100m", memory: "100Mi" } },
                        ports: [{ name: "redis", containerPort: 6379 }],
                    },
                    redisExporter(),
                ],
            },
        },
    },
});
new k8s.core.v1.Service("redis-leader", {
    metadata: { name: "redis-leader", namespace, labels: { ...redisLeaderLabels, ...partOf } },
    spec: {
        ports: [{ name: "redis", port: 6379, targetPort: 6379 }],
        selector: redisLeaderLabels,
    },
});
metricsService("redis-leader", 9121, redisLeaderDeployment);

//
// REDIS REPLICA
//
const redisReplicaLabels = { app: "redis-replica" };
const redisReplicaDeployment = new k8s.apps.v1.Deployment("redis-replica", {
    metadata: { namespace, labels: { ...redisReplicaLabels, ...partOf } },
    spec: {
        selector: { matchLabels: redisReplicaLabels },
        template: {
            metadata: { labels: { ...redisReplicaLabels, ...partOf } },
            spec: {
                containers: [
                    {
                        name: "replica",
                        image: "pulumi/guestbook-redis-replica",
                        resources: { requests: { cpu: "100m", memory: "100Mi" } },
                        env: [{ name: "GET_HOSTS_FROM", value: "dns" }],
                        ports: [{ name: "redis", containerPort: 6379 }],
                    },
                    redisExporter(),
                ],
            },
        },
    },
});
new k8s.core.v1.Service("redis-replica", {
    metadata: { name: "redis-replica", namespace, labels: { ...redisReplicaLabels, ...partOf } },
    spec: {
        ports: [{ name: "redis", port: 6379, targetPort: 6379 }],
        selector: redisReplicaLabels,
    },
});
metricsService("redis-replica", 9121, redisReplicaDeployment);

//
// FRONTEND
//

// The guestbook frontend is php:5-apache. This drop-in guarantees mod_status is loaded and
// /server-status is served to localhost only, so the apache_exporter sidecar can read
// request counters while nothing outside the pod can.
const apacheStatusConf = new k8s.core.v1.ConfigMap("frontend-apache-status", {
    metadata: { namespace, labels: partOf },
    data: {
        "zz-server-status.conf": [
            "<IfModule !status_module>",
            "    LoadModule status_module /usr/lib/apache2/modules/mod_status.so",
            "</IfModule>",
            "ExtendedStatus On",
            "<Location \"/server-status\">",
            "    SetHandler server-status",
            "    Require local",
            "</Location>",
            "",
        ].join("\n"),
    },
});

const frontendLabels = { app: "frontend" };
const frontendDeployment = new k8s.apps.v1.Deployment("frontend", {
    metadata: { namespace, labels: { ...frontendLabels, ...partOf } },
    spec: {
        selector: { matchLabels: frontendLabels },
        replicas: 3,
        template: {
            metadata: { labels: { ...frontendLabels, ...partOf } },
            spec: {
                containers: [
                    {
                        name: "frontend",
                        image: "pulumi/guestbook-php-redis",
                        resources: { requests: { cpu: "100m", memory: "100Mi" } },
                        env: [{ name: "GET_HOSTS_FROM", value: "dns" }],
                        ports: [{ name: "http", containerPort: 80 }],
                        readinessProbe: { httpGet: { path: "/", port: "http" }, periodSeconds: 10 },
                        volumeMounts: [{
                            name: "apache-status",
                            mountPath: "/etc/apache2/conf-enabled/zz-server-status.conf",
                            subPath: "zz-server-status.conf",
                            readOnly: true,
                        }],
                    },
                    {
                        name: "apache-exporter",
                        image: cfg.apacheExporterImage,
                        args: ["--scrape_uri=http://localhost/server-status?auto"],
                        ports: [{ name: "metrics", containerPort: 9117 }],
                        resources: {
                            requests: { cpu: "10m", memory: "16Mi" },
                            limits: { memory: "64Mi" },
                        },
                    },
                ],
                volumes: [{ name: "apache-status", configMap: { name: apacheStatusConf.metadata.name } }],
            },
        },
    },
});
const frontendService = new k8s.core.v1.Service("frontend", {
    metadata: { name: "frontend", namespace, labels: { ...frontendLabels, ...partOf } },
    spec: {
        type: cfg.isMinikube ? "ClusterIP" : "LoadBalancer",
        ports: [{ name: "http", port: 80, targetPort: "http" }],
        selector: frontendLabels,
    },
});
metricsService("frontend", 9117, frontendDeployment);

//
// TRAFFIC GENERATOR (optional) – steady trickle of requests so request-rate panels have data.
//
if (cfg.enableTrafficGenerator) {
    const tgLabels = { app: "traffic-generator" };
    new k8s.apps.v1.Deployment("traffic-generator", {
        metadata: { namespace, labels: { ...tgLabels, ...partOf } },
        spec: {
            replicas: 1,
            selector: { matchLabels: tgLabels },
            template: {
                metadata: { labels: { ...tgLabels, ...partOf } },
                spec: {
                    containers: [{
                        name: "curl",
                        image: "curlimages/curl:8.11.1",
                        command: ["/bin/sh", "-c"],
                        args: [
                            "while true; do " +
                            "curl -s -o /dev/null http://frontend/; " +
                            "curl -s -o /dev/null 'http://frontend/guestbook.php?cmd=get&key=messages'; " +
                            "sleep 1; done",
                        ],
                        resources: { requests: { cpu: "5m", memory: "8Mi" }, limits: { memory: "32Mi" } },
                    }],
                },
            },
        },
    }, { dependsOn: [frontendService] });
}

// The frontend address, matching the original example's output.
export const frontendIp: pulumi.Output<string> = cfg.isMinikube
    ? frontendService.spec.clusterIP
    : frontendService.status.loadBalancer.ingress.apply(i =>
        i && i.length > 0 ? (i[0].hostname ?? i[0].ip ?? "pending") : "pending");
