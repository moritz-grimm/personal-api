import { Hono } from "hono";
import { monitorSlugMap, TTL, type HeartbeatResponse, type StatusEntry, type StatusPageResponse } from "./constants.js";

export const status = new Hono();

let cache: { data: StatusEntry[]; time: number } | null = null;

status.get("/", async(c) => {
    if (cache && Date.now() - cache.time < TTL) {
        return c.json(cache.data);
    }

    const res = await fetchMonitors();
    cache = { data: res, time: Date.now() };

    return c.json(res);
});

status.get("/:monitor", async(c) => {
    const monitor = c.req.param("monitor");
    const statusList = await fetchMonitors();

    const found = statusList.find(entry => entry.name === monitor || entry.slug === monitor);

    if (!found) {
        return c.json({ error: "Monitor not found" }, 404);
    }

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
