import { describe, test, expect } from "vitest";
import app from "../src/app.js";

describe("GET /", () => {
    test("returns 200", async() => {
        const res = await app.request("/");
        expect(res.status).toBe(200);
    });

    test("returns expected body", async() => {
        const res = await app.request("/");
        const body = await res.json() as Record<string, unknown>;

        expect(body).toMatchObject({
            self: { href: "/api" },
            info: { href: "/info" },
            github: { href: "/github" },
            status: { href: "/status" },
            impressum: { href: "/impressum" },
            privacyPolicy: { href: "/privacy-policy" },
        });
    });
});
