/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, expect, test } from "vitest";
import app from "../src/app.js";

describe("GET /github", () => {
    test("returns 400", async() => {
        const res = await app.request("/github");
        expect(res.status).toBe(400);
        expect(await res.text()).toBe("Invalid format. Use 'json' or 'text'.");
    })
})

describe("GET /github?format=text", () => {
    test("returns 200", async() => {
        const res = await app.request("/github?format=text");
        expect(res.status).toBe(200);
    });

    test("returns expected body", async() => {
        const res = await app.request("/github?format=text");
        const body = await res.text();

        expect(body).toMatch(/^Hi, I'm .+, a developer based in .+\./s);
        expect(body).toMatch(/You can reach me at .+ or find me on GitHub/s);
        expect(body).toMatch(/I maintain \d+ public repositories with a combined \d+ stars/s);
        expect(body).toMatch(/My most used languages are .+, .+, .+$/);
    });
});

describe("GET /github?format=json", () => {
    test("returns 200", async() => {
        const res = await app.request("/github?format=json");
        expect(res.status).toBe(200);
    });

    test("returns expected body", async() => {
        const res = await app.request("/github?format=json");
        const body = await res.json() as Record<string, unknown>;

        expect(body).toMatchObject({
            name: expect.any(String),
            email: expect.stringMatching(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
            location: expect.any(String),
            bio: expect.any(String),
            profileUrl: "https://github.com/moritz-grimm",
            createdAt: "2024-10-21T19:20:41Z",
            topLanguages: expect.arrayContaining([expect.any(String)]),
            followerCount: expect.any(Number),
            publicRepos: expect.any(Number),
            totalStarCount: expect.any(Number),
        });
    });
});
