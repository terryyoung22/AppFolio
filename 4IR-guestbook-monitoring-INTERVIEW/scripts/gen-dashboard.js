// Generates dashboards/guestbook.json. Run: node scripts/gen-dashboard.js
const fs = require("fs");
const path = require("path");

const ds = { type: "prometheus", uid: "prometheus" };
const NS = 'namespace="guestbook"';
let id = 1;

function stat(title, expr, x, y, opts = {}) {
    return {
        id: id++, type: "stat", title, datasource: ds,
        gridPos: { h: 4, w: 6, x, y },
        targets: [{ refId: "A", datasource: ds, expr, instant: true }],
        options: { reduceOptions: { calcs: ["lastNotNull"], fields: "", values: false }, colorMode: "background", graphMode: "area" },
        fieldConfig: {
            defaults: {
                unit: opts.unit || "short", decimals: opts.decimals,
                thresholds: { mode: "absolute", steps: opts.steps || [{ color: "green", value: null }] },
            },
            overrides: [],
        },
    };
}

function ts(title, targets, x, y, opts = {}) {
    return {
        id: id++, type: "timeseries", title, datasource: ds, description: opts.description,
        gridPos: { h: 8, w: opts.w || 12, x, y },
        targets: targets.map((t, i) => ({ refId: String.fromCharCode(65 + i), datasource: ds, expr: t.expr, legendFormat: t.legend })),
        options: { legend: { displayMode: "list", placement: "bottom" }, tooltip: { mode: "multi" } },
        fieldConfig: {
            defaults: { unit: opts.unit || "short", custom: { fillOpacity: 10, lineWidth: 1, stacking: { mode: opts.stack ? "normal" : "none" } } },
            overrides: [],
        },
    };
}

function row(title, y) {
    return { id: id++, type: "row", title, collapsed: false, gridPos: { h: 1, w: 24, x: 0, y }, panels: [] };
}

const panels = [
    row("Overview", 0),
    stat("Scrape targets up", `sum(up{${NS}})`, 0, 1),
    stat("Frontend requests / s", `sum(rate(apache_accesses_total{${NS}}[2m]))`, 6, 1, { unit: "reqps", decimals: 2 }),
    stat("Redis commands / s", `sum(rate(redis_commands_processed_total{${NS}}[2m]))`, 12, 1, { unit: "ops", decimals: 1 }),
    stat("Container restarts (1h)", `sum(increase(kube_pod_container_status_restarts_total{${NS}}[1h])) or vector(0)`, 18, 1, {
        decimals: 0,
        steps: [{ color: "green", value: null }, { color: "orange", value: 1 }, { color: "red", value: 5 }],
    }),

    row("Frontend (Apache / PHP)", 5),
    ts("Request rate by pod", [{ expr: `sum by (pod) (rate(apache_accesses_total{${NS}}[2m]))`, legend: "{{pod}}" }], 0, 6, { unit: "reqps" }),
    ts("Avg request duration", [{
        expr: `sum(rate(apache_duration_ms_total{${NS}}[2m])) / clamp_min(sum(rate(apache_accesses_total{${NS}}[2m])), 0.001)`,
        legend: "avg",
    }], 12, 6, { unit: "ms" }),
    ts("Apache workers", [{ expr: `sum by (state) (apache_workers{${NS}})`, legend: "{{state}}" }], 0, 14, { stack: true }),
    ts("Error signals", [
        { expr: `1 - avg(apache_up{${NS}})`, legend: "apache status unreachable (ratio)" },
        { expr: `1 - avg(redis_up{${NS}})`, legend: "redis unreachable (ratio)" },
        { expr: `sum(kube_deployment_status_replicas_unavailable{${NS}})`, legend: "unavailable replicas" },
    ], 12, 14, { description: "The stock guestbook image doesn't emit HTTP status codes; these are availability-based error signals." }),

    row("Backend (Redis)", 22),
    ts("Commands processed / s", [{ expr: `sum by (component) (rate(redis_commands_processed_total{${NS}}[2m]))`, legend: "{{component}}" }], 0, 23, { unit: "ops" }),
    ts("Connected clients", [{ expr: `sum by (component) (redis_connected_clients{${NS}})`, legend: "{{component}}" }], 12, 23),
    ts("Memory used", [{ expr: `sum by (component) (redis_memory_used_bytes{${NS}})`, legend: "{{component}}" }], 0, 31, { unit: "bytes" }),
    ts("Replication: connected replicas on leader", [{ expr: `max(redis_connected_slaves{${NS},component="redis-leader"})`, legend: "replicas" }], 12, 31),

    row("Pod resources", 39),
    ts("CPU usage by pod", [{
        expr: `sum by (pod) (rate(container_cpu_usage_seconds_total{${NS},container!="",container!="POD"}[2m]))`, legend: "{{pod}}",
    }], 0, 40, { unit: "cores" }),
    ts("Memory working set by pod", [{
        expr: `sum by (pod) (container_memory_working_set_bytes{${NS},container!="",container!="POD"})`, legend: "{{pod}}",
    }], 12, 40, { unit: "bytes" }),
];

const dashboard = {
    uid: "guestbook-overview",
    title: "Guestbook Overview",
    tags: ["guestbook", "pulumi"],
    timezone: "browser",
    schemaVersion: 39,
    version: 1,
    editable: true,
    refresh: "30s",
    time: { from: "now-30m", to: "now" },
    annotations: { list: [] },
    templating: { list: [] },
    panels,
};

const out = path.join(__dirname, "..", "dashboards", "guestbook.json");
fs.writeFileSync(out, JSON.stringify(dashboard, null, 2) + "\n");
console.log(`wrote ${out} (${panels.length} panels)`);
