import { serve } from "@hono/node-server";
import { Hono } from "hono";
import info from "./routes/info.js";
import github from "./routes/github.js";
import api from "./routes/api.js";

const app = new Hono();

app.route("/", api);
app.route("/info", info);
app.route("/github", github);

serve({
    fetch: app.fetch,
    port: 3000,
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});

export default app;
