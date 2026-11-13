import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();

export const isMinikube = config.getBoolean("isMinikube") ?? false;

export const grafanaServiceType = config.get("grafanaServiceType") ?? (isMinikube ? "NodePort" : "LoadBalancer");
if (grafanaServiceType !== "LoadBalancer" && grafanaServiceType !== "NodePort") {
    throw new Error(`grafanaServiceType must be "LoadBalancer" or "NodePort", got "${grafanaServiceType}"`);
}

export const grafanaNodePort = config.getNumber("grafanaNodePort") ?? 30300;

export const nodeHost = config.get("nodeHost") ?? "localhost";

export const grafanaAdminUser = config.get("grafanaAdminUser") ?? "admin";
export const grafanaAdminPassword = config.getSecret("grafanaAdminPassword");

export const enableTrafficGenerator = config.getBoolean("enableTrafficGenerator") ?? true;

export const kubePrometheusStackVersion = config.get("kubePrometheusStackVersion") ?? "93.2.2";
export const apacheExporterImage = config.get("apacheExporterImage") ?? "quay.io/lusitaniae/apache-exporter:v1.0.10";
export const redisExporterImage = config.get("redisExporterImage") ?? "oliver006/redis_exporter:v1.96.0";

export const guestbookNamespace = "guestbook";
export const monitoringNamespace = "monitoring";

export const releaseName = "kps";
