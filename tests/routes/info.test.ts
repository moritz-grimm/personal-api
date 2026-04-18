import { describe, expect, test } from "vitest";
import app from "../../src/app.js";

describe("GET /info", () => {
    test("returns 200 with greeting text", async() => {
        const res = await app.request("/info");
        const body = await res.text();

        expect(res.status).toBe(200);
        expect(body).toBe("Hello! My name is Moritz :)");
    });
});
