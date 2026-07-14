import { Hono } from "hono";
import { rateLimiter } from "hono-throttle";
import { HTTPException } from "hono/http-exception";
import { corsMiddleware } from "./middleware/cors.js";
import { umami } from "./middleware/umami.js";
import fourhundredeighteen from "./routes/418/418.js";
import algorithms from "./routes/algorithms.js";
import api from "./routes/api.js";
import github from "./routes/github/github.js";
import { impressum } from "./routes/impressum.js";
import info from "./routes/info.js";
import lastUpdated from "./routes/last-updated.js";
import { privacyPolicy } from "./routes/privacy-policy.js";
import status from "./routes/status/status.js";

const app = new Hono();

app.use("*", corsMiddleware);
app.use("*", umami);
app.use(rateLimiter({
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
    whitelist: [ "10.0.1.1" ],
}));

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
