import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { namespacedCache } from "../../lib/redis.js";
import { monitorSlugMap, TTL, type HeartbeatResponse, type StatusEntry, type StatusPageResponse } from "./status.constants.js";

const status = new Hono();
const cache = namespacedCache("status");
const FETCH_TIMEOUT = 5000;

status.get("/", async(c) => {

    return c.json(await getMonitors());
});

status.get("/:monitor", async(c) => {
    const monitor = c.req.param("monitor");
    const monitors = await getMonitors();

    const found = monitors.find(entry => entry.name === monitor || entry.slug === monitor);
    if (!found) throw new HTTPException(404, { message: "Monitor not found" });

    return c.json(found);
});

export default status;

async function fetchMonitors(): Promise<StatusEntry[]> {
    const [ statusPageRes, heartbeatRes ] = await Promise.all([
        fetch("https://status.moritz-grimm.dev/api/status-page/default", { signal: AbortSignal.timeout(FETCH_TIMEOUT) }),
        fetch("https://status.moritz-grimm.dev/api/status-page/heartbeat/default", { signal: AbortSignal.timeout(FETCH_TIMEOUT) }),
    ]);

    if (!statusPageRes.ok || !heartbeatRes.ok) throw new Error(`Status page fetch failed: ${statusPageRes.status} / ${heartbeatRes.status}`);

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

async function getMonitors(): Promise<StatusEntry[]> {
    const cached = await cache.get("all");
    let monitors: StatusEntry[];

    if (cached) {
        monitors = JSON.parse(cached) as StatusEntry[];
    } else {
        try {
            monitors = await fetchMonitors();
        } catch (err) {
            console.error(err);
            throw new HTTPException(502, { message: "Status page unreachable" });
        }
        await cache.set("all", JSON.stringify(monitors), TTL);
    }

    return monitors;
}
