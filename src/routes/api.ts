import { Hono } from "hono";

const api = new Hono();

api.get("/", (c) => {
    return c.json({
        self: { href: "/api", description: "Lists all available endpoints" },
        info: { href: "/info", description: "General information about me" },
        github: { href: "/github", description: "My GitHub profile and activity" },
        status: { href: "/status", description: "Status of my services" },
        impressum: { href: "/impressum", description: "Legal notice (Impressum)" },
        privacyPolicy: { href: "/privacy-policy", description: "Privacy Policy" },
    });
});

export default api;
