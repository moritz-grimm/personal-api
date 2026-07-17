import "dotenv/config";

export type Env = {
    RATELIMIT_WHITELIST: string[];
    GITHUB_TOKEN: string;
    REDIS_URL?: string;
    REDIS_PASSWORD?: string;
    UMAMI_URL?: string;
    UMAMI_WEBSITE_ID?: string;
    RUN_SLOW?: string;
};

const ratelimitWhitelist = process.env.RATELIMIT_WHITELIST?.split(",") || [];
const githubToken = process.env.GITHUB_TOKEN;
const redisUrl = process.env.REDIS_URL;
const redisPassword = process.env.REDIS_PASSWORD;
const umamiUrl = process.env.UMAMI_URL;
const umamiWebsiteId = process.env.UMAMI_WEBSITE_ID;
const runSlow = process.env.RUN_SLOW;

if (!githubToken) throw new Error("Required .env property missing");

export const env: Env = {
    RATELIMIT_WHITELIST: ratelimitWhitelist,
    GITHUB_TOKEN: githubToken,
    REDIS_URL: redisUrl,
    REDIS_PASSWORD: redisPassword,
    UMAMI_URL: umamiUrl,
    UMAMI_WEBSITE_ID: umamiWebsiteId,
    RUN_SLOW: runSlow,
};
