import type { MiddlewareHandler } from "hono";
import { existsSync } from "node:fs";
import { join } from "node:path";

const envPath = join(process.cwd(), ".env");
if (existsSync(envPath)) {
    process.loadEnvFile(envPath);
}

const UMAMI_URL = process.env.UMAMI_URL;
const UMAMI_WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;

export const umami: MiddlewareHandler = async(c, next) => {
    await next();

    if (!UMAMI_URL || !UMAMI_WEBSITE_ID) return;

    const url = new URL(c.req.url);
    fetch(`${UMAMI_URL}/api/send`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        },
        body: JSON.stringify({
            type: "event",
            payload: {
                hostname: url.hostname,
                url: url.pathname,
                website: UMAMI_WEBSITE_ID,
                language: c.req.header("Accept-Language")?.split(",")[0] || "",
                referrer: c.req.header("Referer") || "",
                name: `${c.req.method} ${url.pathname}`,
                data: {
                    method: c.req.method,
                    status: c.res.status,
                    userAgent: c.req.header("User-Agent") || "Unknown",
                },
            },
        }),
    }).catch(() => {});
};
