import { describe, expect, test } from "vitest";
import app from "../../src/app.js";

describe("GET /privacy-policy", () => {
    test("returns 200 with privacy policy URL", async() => {
        const res = await app.request("/privacy-policy");
        const body = await res.json() as Record<string, unknown>;

        expect(res.status).toBe(200);
        expect(body).toMatchObject({
            privacyPolicy: "https://www.moritz-grimm.dev/privacy-policy.html",
        });
    });
});
