import { Hono } from "hono";

type Monitor = {
    id: number;
    name: string;
    sendUrl: number;
    type: string;
};

type Incident = Record<string, unknown>;

type Maintenance = Record<string, unknown>;

type StatusPageResponse = {
    incidents: Incident[];
    publicGroupList: { monitorList: Monitor[] }[];
    maintenanceList: Maintenance[];
};

type HeartbeatEntry = {
    status: number;
    time: string;
    msg: string;
    ping: number;
};

type HeartbeatResponse = {
    heartbeatList: Record<string, HeartbeatEntry[]>;
    uptimeList: Record<string, number>;
};

type StatusResponse = {
    name: string,
    slug: string | undefined,
    href: string | undefined,
    status: number | undefined,
    ping: number | undefined,
    uptime24h: number,
}[];

const monitorSlugMap: Record<string, string> = {
    "www.moritz-grimm.dev": "homepage",
    "api.moritz-grimm.dev": "api",
    "knowledge.moritz-grimm.dev": "knowledge",
};

export const status = new Hono();

let cache: { data: unknown; time: number } | null = null;
const TTL = 60_000; // 60s

status.get("/", async(c) => {
    if (cache && Date.now() - cache.time < TTL ) {
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

async function fetchMonitors(): Promise<StatusResponse> {
    const [ pageRes, heartbeatRes ] = await Promise.all([
        fetch("https://status.moritz-grimm.dev/api/status-page/default"),
        fetch("https://status.moritz-grimm.dev/api/status-page/heartbeat/default"),
    ]);

    const page = await pageRes.json() as StatusPageResponse;
    const heartbeats = await heartbeatRes.json() as HeartbeatResponse;

    return page.publicGroupList
        .flatMap(service => service.monitorList)
        .map(entry => {
            const beats = heartbeats.heartbeatList[entry.id] ?? [];
            const latest = beats.at(-1);
            const slug = monitorSlugMap[entry.name];

            return {
                name: entry.name,
                slug: slug,
                href: `/status/${slug}`,
                status: latest?.status,
                ping: latest?.ping,
                uptime24h: heartbeats.uptimeList[`${entry.id}_24`] ?? null,
            };
        });
}
