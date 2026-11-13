# Guestbook with Prometheus & Grafana

This is the Pulumi Kubernetes Guestbook example with monitoring added. Running `pulumi up` deploys:

- The Guestbook app (PHP frontend plus Redis leader and replica)
- Prometheus and Grafana, installed with the `kube-prometheus-stack` Helm chart
- A ServiceMonitor so Prometheus scrapes the frontend and Redis
- A "Guestbook Overview" Grafana dashboard showing request rate, Redis activity and pod CPU/memory

The original Guestbook images don't expose metrics. To get them, each pod runs a small exporter container next to the app: an Apache exporter on the frontend and a Redis exporter on each Redis pod.

## Prerequisites

- Pulumi CLI, Node.js and npm
- kubectl pointed at a cluster (minikube, kind, Docker Desktop, or a cloud cluster like EKS)

## Commands to run

```bash
npm install
pulumi login --local          # or use Pulumi Cloud
pulumi stack init dev
```

**On minikube or another local cluster, since I use this:**

```bash
pulumi config set isMinikube true
pulumi config set nodeHost $(minikube ip)
pulumi up
```

The first deploy takes a few minutes while the images download.

## Grafana access

Pulumi prints the Grafana URL and login when the deploy finishes. You can also get them anytime:

```bash
pulumi stack output grafanaUrl
pulumi stack output grafanaAdminUser
pulumi stack output grafanaAdminPassword --show-secrets
```

- **URL:** a LoadBalancer address on cloud clusters, or `http://<minikube-ip>:30300` on minikube
- **Username:** `admin`
- **Password:** generated when you first deploy and stored as a Pulumi secret. Use the command above to see it.

If the URL won't open in your browser (common with minikube on Mac/Windows), use port-forwarding instead:

```bash
kubectl -n monitoring port-forward svc/grafana 3000:80
```

Then go to http://localhost:3000.

The dashboard is under **Dashboards → Guestbook Overview**.

## Prometheus scrape check for Guestbook verification

```bash
kubectl -n monitoring port-forward svc/prometheus-operated 9090:9090
```

Open http://localhost:9090/targets and search for `guestbook`. You should see 5 targets marked **UP**: 3 frontend pods, the Redis leader and the Redis replica.

To see the metrics themselves, this query here in the Prometheus or Grafana query box:

```
sum(rate(apache_accesses_total{namespace="guestbook"}[2m]))
```

## Clean up

```bash
pulumi destroy
```
# Let me know if you all have any questions!
# Terry