import { serve } from "@hono/node-server";
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

const app = new Hono();

app.use("*", corsMiddleware);
app.use("*", umami);

app.route("/", api);
app.route("/info", info);
app.route("/impressum", impressum);
app.route("/privacy-policy", privacyPolicy);
app.route("/github", github);
app.route("/status", status);
app.route("/418", fourhundredeighteen);
app.route("/fourhundredeighteen", fourhundredeighteen);

serve({
    fetch: app.fetch,
    port: 3000,
    hostname: "0.0.0.0",
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});

export default app;
