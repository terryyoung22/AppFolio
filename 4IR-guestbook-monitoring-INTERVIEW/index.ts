// Entry point: Guestbook app + Prometheus/Grafana monitoring.

import { frontendIp } from "./guestbook";
import {
    grafanaAdminPassword,
    grafanaAdminUser,
    grafanaPortForward,
    grafanaUrl,
    prometheusPortForward,
} from "./monitoring";

export {
    frontendIp,
    grafanaUrl,
    grafanaAdminUser,
    grafanaAdminPassword,
    grafanaPortForward,
    prometheusPortForward,
};
