
import { describe, expect, test } from "vitest";
import app from "../src/app.js";

describe("GET /impressum", () => {
    test("returns 200", async() => {
        const res = await app.request("/impressum");
        expect(res.status).toBe(200);
    });

    test("returns expected body", async() => {
        const res = await app.request("/impressum");
        const body = await res.json() as Record<string, unknown>;

        expect(body).toMatchObject({
            impressum: "https://www.moritz-grimm.dev/impressum.html",
        });
    });
});
