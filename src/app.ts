import { Hono } from "hono";
import { corsMiddleware } from "./middleware/cors.js";
import { umami } from "./middleware/umami.js";
import info from "./routes/info.js";
import github from "./routes/github.js";
import api from "./routes/api.js";
import fourhundredeighteen from "./routes/418/index.js";
import { impressum } from "./routes/impressum.js";
import { status } from "./routes/status.js";
import { privacyPolicy } from "./routes/privacy-policy.js";
import { lastUpdated } from "./routes/last-updated.js";
import algorithms from "./routes/algorithms/algorithms.js";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

app.use("*", corsMiddleware);
app.use("*", umami);

app.route("/", api);
app.route("/info", info);
app.route("/impressum", impressum);
app.route("/privacy-policy", privacyPolicy);
app.route("/github", github);
app.route("/status", status);
app.route("/last-updated", lastUpdated);
app.route("/418", fourhundredeighteen);
app.route("/fourhundredeighteen", fourhundredeighteen);
app.route("/algorithms", algorithms);

app.onError((err, c) => {
    if (err instanceof HTTPException) {
        return c.json({ error: err.message }, err.status);
    }
    return c.json({ error: "Internal server error" }, 500);
});

export default app;
