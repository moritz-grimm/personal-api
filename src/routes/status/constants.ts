export type Monitor = {
    id: number;
    name: string;
    sendUrl: number;
    type: string;
};

export type Incident = Record<string, unknown>;

export type Maintenance = Record<string, unknown>;

export type StatusPageResponse = {
    incidents: Incident[];
    publicGroupList: { monitorList: Monitor[] }[];
    maintenanceList: Maintenance[];
};

export type HeartbeatEntry = {
    status: number;
    time: string;
    msg: string;
    ping: number;
};

export type HeartbeatResponse = {
    heartbeatList: Record<string, HeartbeatEntry[]>;
    uptimeList: Record<string, number>;
};

export type StatusResponse = {
    name: string,
    slug: string | undefined,
    href: string | undefined,
    status: number | undefined,
    ping: number | undefined,
    uptime24h: number,
}[];

export const monitorSlugMap: Record<string, string> = {
    "www.moritz-grimm.dev": "homepage",
    "api.moritz-grimm.dev": "api",
    "knowledge.moritz-grimm.dev": "knowledge",
};

export const TTL = 60_000; // 60s
