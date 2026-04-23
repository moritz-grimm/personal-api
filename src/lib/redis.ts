import { createClient } from "redis";

type NamespacedCache = {
    get: (key: string) => Promise<string | null>;
    set: (key: string, value: string, ttlSeconds: number) => Promise<void>;
};

export const redis = createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
}).on("error", (err: NodeJS.ErrnoException) => console.error("Redis Client Error", err.code ?? err));

try {
    await redis.connect();
    console.log("Connection to redis database established");
} catch (err) {
    console.error("Redis initial connect failed", err ?? err);
}

export async function cacheGet(key: string): Promise<string | null> {
    try {
        return await redis.get(key);
    } catch (err) {
        console.error(`Redis get failed for key '${key}'`, err);
        return null;
    }
}

export async function cacheSet(key: string, value: string, ttlSeconds: number): Promise<void> {
    try {
        await redis.set(key, value, { expiration: { type: "EX", value: ttlSeconds } });
    } catch (err) {
        console.error(`Redis set failed for key '${key}'`, err);
    }
}

export function namespacedCache(namespace: string): NamespacedCache {
    return {
        get: (key: string): Promise<string | null> => cacheGet(`${namespace}:${key}`),
        set: (key: string, value: string, ttlSeconds: number): Promise<void> => cacheSet(`${namespace}:${key}`, value, ttlSeconds),
    };
}
