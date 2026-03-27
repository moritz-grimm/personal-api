/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, expect, test } from "vitest";
import app from "../src/app.js";

describe("GET /status", () => {
    test("returns 200", async() => {
        const res = await app.request("/status");
        expect(res.status).toBe(200);
    });

    test("returns expected body", async() => {
        const res = await app.request("/status");
        const body = await res.json();

        expect(Array.isArray(body)).toBe(true);
        for (const entry of body as unknown[]) {
            expect(entry).toMatchObject({
                name: expect.any(String),
                status: expect.any(Number),
                ping: expect.any(Number),
                uptime24h: expect.any(Number),
            });
        }
    });
});
