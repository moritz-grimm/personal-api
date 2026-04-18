import { describe, expect, test } from "vitest";
import app from "../../src/app.js";

describe("GET /info", () => {
    test("returns 200", async() => {
        const res = await app.request("/info");
        expect(res.status).toBe(200);
    });

    test("returns expected body", async() => {
        const res = await app.request("/info");
        const body = await res.text();

        expect(body).toBe("Hello! My name is Moritz :)");
    });
});
