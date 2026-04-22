import { createClient } from "redis";

export const redis = await createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
})
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

if (redis.isReady) {
    console.log("Connection to redis database established");
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
