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

export const status = new Hono();

let cache: { data: unknown; time: number } | null = null;
const TTL = 60_000;

status.get("/", async(c) => {
    if (cache && Date.now() - cache.time < TTL ) {
        return c.json(cache.data);
    }

    const [ pageRes, heartbeatRes ] = await Promise.all([
        fetch("https://status.moritz-grimm.dev/api/status-page/default"),
        fetch("https://status.moritz-grimm.dev/api/status-page/heartbeat/default"),
    ]);

    const page = await pageRes.json() as StatusPageResponse;
    const heartbeats = await heartbeatRes.json() as HeartbeatResponse;

    const res = page.publicGroupList
        .flatMap(service => service.monitorList)
        .map(entry => {
            const beats = heartbeats.heartbeatList[entry.id] ?? [];
            const latest = beats.at(-1);

            return {
                name: entry.name,
                status: latest?.status,
                ping: latest?.ping,
                uptime24h: heartbeats.uptimeList[`${entry.id}_24`] ?? null,
            };
        });

    cache = { data: res, time: Date.now() };

    return c.json(res);
});
