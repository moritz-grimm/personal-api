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
                uptime24h: expect.any(Number),
            });
            expect(entry).toHaveProperty("slug");
            expect(entry).toHaveProperty("href");
            expect(entry).toHaveProperty("status");
            expect(entry).toHaveProperty("ping");
        }
    });
});

describe("GET /status/:monitor", () => {
    test("returns 404 on unknown status monitor", async() => {
        const res = await app.request("/status/unknown-monitor");

        expect(res.status).toBe(404);
    });

    test("returns 200 and monitor in body on success with slug", async() => {
        const res = await app.request("/status/homepage");
        const body = await res.json();

        expect(body).toMatchObject({
            name: expect.any(String),
            uptime24h: expect.any(Number),
        });
        expect(body).toHaveProperty("slug");
        expect(body).toHaveProperty("href");
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("ping");
    });

    test("returns 200 and monitor in body on success with full address", async() => {
        const res = await app.request("/status/www.moritz-grimm.dev");
        const body = await res.json();

        expect(body).toMatchObject({
            name: expect.any(String),
            uptime24h: expect.any(Number),
        });
        expect(body).toHaveProperty("slug");
        expect(body).toHaveProperty("href");
        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("ping");
    });
});
