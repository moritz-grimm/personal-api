import { Hono } from "hono";
import { namespacedCache } from "../../lib/redis.js";
import { monitorSlugMap, TTL, type HeartbeatResponse, type StatusEntry, type StatusPageResponse } from "./status.constants.js";

const status = new Hono();
const cache = namespacedCache("status");

status.get("/", async(c) => {
    const cached = await cache.get("all");
    if (cached) return c.json(JSON.parse(cached));

    const monitors = await fetchMonitors();
    await cache.set("all", JSON.stringify(monitors), TTL);

    return c.json(monitors);
});

status.get("/:monitor", async(c) => {
    const monitor = c.req.param("monitor");

    const cached = await cache.get(monitor);
    if (cached) return c.json(JSON.parse(cached));

    const statusList = await fetchMonitors();
    const found = statusList.find(entry => entry.name === monitor || entry.slug === monitor);
    if (!found) return c.json({ error: "Monitor not found" }, 404);

    await cache.set(monitor, JSON.stringify(found), TTL);
    return c.json(found);
});

export default status;

async function fetchMonitors(): Promise<StatusEntry[]> {
    const [ statusPageRes, heartbeatRes ] = await Promise.all([
        fetch("https://status.moritz-grimm.dev/api/status-page/default"),
        fetch("https://status.moritz-grimm.dev/api/status-page/heartbeat/default"),
    ]);

    const statusPage = await statusPageRes.json() as StatusPageResponse;
    const heartbeats = await heartbeatRes.json() as HeartbeatResponse;

    return statusPage.publicGroupList
        .flatMap(group => group.monitorList)
        .map(monitor => {
            const monitorHeartbeats = heartbeats.heartbeatList[monitor.id] ?? [];
            const latest = monitorHeartbeats.at(-1);
            const slug = monitorSlugMap[monitor.name];

            return {
                name: monitor.name,
                slug: slug,
                href: `/status/${slug}`,
                status: latest?.status,
                ping: latest?.ping,
                uptime24h: heartbeats.uptimeList[`${monitor.id}_24`] ?? null,
            };
        });
}
