import { Hono } from "hono";
import pkg from "../../package.json" with { type: "json" };
import { redis } from "../lib/redis.js";

const health = new Hono();

health.get("/", (c) => {
    return c.body(null, 200);
});

health.get("/ready", (c) => {
    return c.json({
        "status": "ok",
        "version": pkg.version,
        "redis": redis?.isReady ? "up" : "down",
    }, 200);
});

export default health;
