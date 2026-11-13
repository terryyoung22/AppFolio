// Prometheus + Grafana via kube-prometheus-stack, plus Guestbook ServiceMonitor and dashboard.

import * as fs from "fs";
import * as path from "path";
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import * as random from "@pulumi/random";
import * as cfg from "./config";
import { namespace as guestbookNamespace, scrapeLabel } from "./guestbook";

const ns = new k8s.core.v1.Namespace("monitoring", {
    metadata: { name: cfg.monitoringNamespace },
});

// Admin password: taken from config if set, otherwise generated. Either way it's a Pulumi secret.
const adminPassword: pulumi.Output<string> = cfg.grafanaAdminPassword
    ?? new random.RandomPassword("grafana-admin-password", { length: 20, special: false }).result;

const grafanaService: Record<string, unknown> = { type: cfg.grafanaServiceType };
if (cfg.grafanaServiceType === "NodePort") {
    grafanaService.nodePort = cfg.grafanaNodePort;
}

const stack = new k8s.helm.v3.Release("kube-prometheus-stack", {
    name: cfg.releaseName,
    namespace: ns.metadata.name,
    chart: "kube-prometheus-stack",
    version: cfg.kubePrometheusStackVersion,
    repositoryOpts: { repo: "https://prometheus-community.github.io/helm-charts" },
    timeout: 900,
    values: {
        // Control-plane components aren't scrapeable on managed (EKS/GKE/AKS) or local clusters;
        // disabling them keeps the Targets page free of permanently-down jobs.
        kubeEtcd: { enabled: false },
        kubeControllerManager: { enabled: false },
        kubeScheduler: { enabled: false },
        kubeProxy: { enabled: false },
        alertmanager: { enabled: false },

        prometheus: {
            prometheusSpec: {
                // Pick up ServiceMonitors/PodMonitors from any namespace, regardless of labels.
                serviceMonitorSelectorNilUsesHelmValues: false,
                podMonitorSelectorNilUsesHelmValues: false,
                probeSelectorNilUsesHelmValues: false,
                ruleSelectorNilUsesHelmValues: false,
                scrapeInterval: "15s",
                retention: "2d",
                resources: { requests: { cpu: "200m", memory: "512Mi" } },
            },
        },

        grafana: {
            fullnameOverride: "grafana",
            adminUser: cfg.grafanaAdminUser,
            adminPassword: adminPassword,
            service: grafanaService,
            defaultDashboardsTimezone: "browser",
            sidecar: {
                // Load any ConfigMap labelled grafana_dashboard=1 from any namespace.
                dashboards: { enabled: true, label: "grafana_dashboard", labelValue: "1", searchNamespace: "ALL" },
            },
        },

        // Docker Desktop / kind can't do rslave mounts of the host root; node metrics still work without it.
        "prometheus-node-exporter": { hostRootFsMount: { enabled: false } },
    },
});

//
// Scrape config for the Guestbook: one ServiceMonitor that matches every *-metrics Service.
// `jobLabel: app` makes the Prometheus job name "frontend", "redis-leader", "redis-replica".
//
new k8s.apiextensions.CustomResource("guestbook-servicemonitor", {
    apiVersion: "monitoring.coreos.com/v1",
    kind: "ServiceMonitor",
    metadata: {
        name: "guestbook",
        namespace: guestbookNamespace,
        labels: { release: cfg.releaseName, "app.kubernetes.io/part-of": "guestbook" },
    },
    spec: {
        jobLabel: "app",
        selector: { matchLabels: scrapeLabel },
        namespaceSelector: { matchNames: [cfg.guestbookNamespace] },
        endpoints: [{
            port: "metrics",
            interval: "15s",
            path: "/metrics",
            relabelings: [
                // Surface the pod's Deployment-level app label as `component` for dashboards.
                { sourceLabels: ["__meta_kubernetes_pod_label_app"], targetLabel: "component" },
            ],
        }],
    },
}, { dependsOn: [stack] }); // CRD is installed by the chart

//
// Grafana dashboard, auto-provisioned by the Grafana sidecar.
//
new k8s.core.v1.ConfigMap("guestbook-dashboard", {
    metadata: {
        name: "guestbook-dashboard",
        namespace: ns.metadata.name,
        labels: { grafana_dashboard: "1" },
    },
    data: {
        "guestbook.json": fs.readFileSync(path.join(__dirname, "dashboards", "guestbook.json"), "utf8"),
    },
}, { dependsOn: [stack] });

//
// Grafana access details. Read the Service the chart created to get its external address.
//
const grafanaSvc = k8s.core.v1.Service.get(
    "grafana-svc",
    pulumi.interpolate`${stack.status.namespace}/grafana`,
    { dependsOn: [stack] },
);

export const grafanaUrl: pulumi.Output<string> = cfg.grafanaServiceType === "LoadBalancer"
    ? grafanaSvc.status.loadBalancer.ingress.apply(i => {
        const addr = i && i.length > 0 ? (i[0].hostname ?? i[0].ip) : undefined;
        return addr ? `http://${addr}` : "pending (run: kubectl -n monitoring get svc grafana)";
    })
    : grafanaSvc.spec.ports.apply(p => `http://${cfg.nodeHost}:${p[0].nodePort}`);

export const grafanaAdminUser = cfg.grafanaAdminUser;
export const grafanaAdminPassword = pulumi.secret(adminPassword);
export const grafanaPortForward = "kubectl -n monitoring port-forward svc/grafana 3000:80  # then open http://localhost:3000";
export const prometheusPortForward = "kubectl -n monitoring port-forward svc/prometheus-operated 9090:9090  # then open http://localhost:9090/targets";
