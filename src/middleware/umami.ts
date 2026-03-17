import type { MiddlewareHandler } from "hono";

const UMAMI_URL = process.env.UMAMI_URL;
const UMAMI_WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;

export const umami: MiddlewareHandler = async(c, next) => {
    await next();

    if (!UMAMI_URL || !UMAMI_WEBSITE_ID) return;

    const url = new URL(c.req.url);
    const userAgent = c.req.header("User-Agent") || "Unknown";

    fetch(`${UMAMI_URL}/api/send`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": userAgent,
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
                },
            },
        }),
    }).catch(() => {});
};
