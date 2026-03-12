import { serve } from "@hono/node-server";
import { Hono } from "hono";
import info from "./routes/info.js";

const app = new Hono();

app.get("/", (c) => {
    return c.text("Hello there!");
});

app.route("/info", info);

serve({
    fetch: app.fetch,
    port: 3000,
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});

export default app;
