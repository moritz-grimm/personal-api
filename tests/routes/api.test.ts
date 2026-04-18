import { describe, test, expect } from "vitest";
import app from "../../src/app.js";

describe("GET /", () => {
    test("returns 200 with all available endpoint links", async() => {
        const res = await app.request("/");
        const body = await res.json() as Record<string, object>;

        console.log(body);

        expect(res.status).toBe(200);
        expect(body).toHaveProperty("info");
        expect(body).toHaveProperty("418");
        expect(body).toHaveProperty("algorithms");
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("github");
    });
});
