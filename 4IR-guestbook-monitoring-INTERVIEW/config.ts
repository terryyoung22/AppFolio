import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();

/** Local cluster with no LoadBalancer implementation (minikube, kind). */
export const isMinikube = config.getBoolean("isMinikube") ?? false;

/** How Grafana is exposed. Defaults to LoadBalancer on cloud clusters, NodePort locally. */
export const grafanaServiceType = config.get("grafanaServiceType") ?? (isMinikube ? "NodePort" : "LoadBalancer");
if (grafanaServiceType !== "LoadBalancer" && grafanaServiceType !== "NodePort") {
    throw new Error(`grafanaServiceType must be "LoadBalancer" or "NodePort", got "${grafanaServiceType}"`);
}

/** Fixed NodePort so the URL is predictable when grafanaServiceType=NodePort. */
export const grafanaNodePort = config.getNumber("grafanaNodePort") ?? 30300;

/** Host used to build the NodePort URL (e.g. `minikube ip`, or localhost for Docker Desktop). */
export const nodeHost = config.get("nodeHost") ?? "localhost";

/** Grafana admin user/password. Password is generated if not supplied. */
export const grafanaAdminUser = config.get("grafanaAdminUser") ?? "admin";
export const grafanaAdminPassword = config.getSecret("grafanaAdminPassword");

/** Small in-cluster load generator so the dashboards have data to show. */
export const enableTrafficGenerator = config.getBoolean("enableTrafficGenerator") ?? true;

/** Pinned versions (override via config if needed). */
export const kubePrometheusStackVersion = config.get("kubePrometheusStackVersion") ?? "93.2.2";
export const apacheExporterImage = config.get("apacheExporterImage") ?? "quay.io/lusitaniae/apache-exporter:v1.0.10";
export const redisExporterImage = config.get("redisExporterImage") ?? "oliver006/redis_exporter:v1.96.0";

export const guestbookNamespace = "guestbook";
export const monitoringNamespace = "monitoring";
/** Helm release name for kube-prometheus-stack; ServiceMonitors carry `release: <this>`. */
export const releaseName = "kps";
