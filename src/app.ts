import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { corsMiddleware } from "./middleware/cors.js";
import { umami } from "./middleware/umami.js";
import fourhundredeighteen from "./routes/418/index.js";
import algorithms from "./routes/algorithms.js";
import api from "./routes/api.js";
import github from "./routes/github.js";
import { impressum } from "./routes/impressum.js";
import info from "./routes/info.js";
import { lastUpdated } from "./routes/last-updated.js";
import { privacyPolicy } from "./routes/privacy-policy.js";
import { status } from "./routes/status/status.js";
import { rateLimiter } from "./lib/rate-limiter.js";

const app = new Hono();
const rateLimitOptions = { maxRequests: 10, windowMs: 15 * 60 * 1000 };

app.use("*", corsMiddleware);
app.use("*", umami);

app.use("/418", rateLimiter(rateLimitOptions));
app.use("/fourhundredeighteen", rateLimiter(rateLimitOptions));
app.use("/algorithms", rateLimiter(rateLimitOptions));
app.use("/status", rateLimiter(rateLimitOptions));
app.use("/", rateLimiter(rateLimitOptions));
app.use("/github", rateLimiter(rateLimitOptions));
app.use("/impressum", rateLimiter(rateLimitOptions));
app.use("/info", rateLimiter(rateLimitOptions));
app.use("/last-updated", rateLimiter(rateLimitOptions));
app.use("/privacy-policy", rateLimiter(rateLimitOptions));

app.route("/418", fourhundredeighteen);
app.route("/fourhundredeighteen", fourhundredeighteen);
app.route("/algorithms", algorithms);
app.route("/status", status);
app.route("/", api);
app.route("/github", github);
app.route("/impressum", impressum);
app.route("/info", info);
app.route("/last-updated", lastUpdated);
app.route("/privacy-policy", privacyPolicy);

app.onError((err, c) => {
    if (err instanceof HTTPException) {
        return c.json({ error: err.message }, err.status);
    }
    return c.json({ error: "Internal server error" }, 500);
});

export default app;
