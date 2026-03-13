import { Hono } from "hono";

const api = new Hono();

api.get("/", (c) => {
    return c.json({
        self: { href: "/api", description: "This endpoint itself" },
        info: { href: "/info", description: "Infos about me" },
        github: { href: "/github", description: "Infos about my Github" },
    });
});

export default api;
