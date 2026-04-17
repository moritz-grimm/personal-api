import { describe, expect, test } from "vitest";
import app from "../../src/app.js";
import { algorithMap, MAX_ARRAY_SIZE } from "../../src/routes/algorithms/constants.js";

type SortResult = {
    time: number,
    result: Array<number>
};

describe("GET /algorithms", () => {
    test("returns list of every available algorithm", async() => {
        const expectedRes = Object.fromEntries(
            Object.entries(algorithMap).map(([key, { description }]) => [
                key,
                { href: `/${key}`, description },
            ]),
        );
        const res = await app.request("/algorithms");

        expect(await res.json()).toEqual(expectedRes);
    });
});

describe("POST /algorithms/:algorithm", () => {
    test("returns 400 on invalid or missing body", async() => {
        const res = await app.request("/algorithms/bubble-sort", {
            method: "POST",
        });

        expect(res.status).toBe(400);
    });

    test("returns 400 if body is missing an array", async() => {
        const res = await app.request("/algorithms/bubble-sort", {
            method: "POST",
            body: JSON.stringify({
                text: "Hello this is a message",
            }),
        });

        expect(res.status).toBe(400);
    });

    test("returns 400 if body contains an invalid array", async() => {
        const res = await app.request("/algorithms/bubble-sort", {
            method: "POST",
            body: JSON.stringify({
                arr: "[2, 4, 2, 3]",
            }),
        });

        expect(res.status).toBe(400);
    });

    test("returns 400 if max array size is exceeded", async() => {
        const res = await app.request("/algorithms/bubble-sort", {
            method: "POST",
            body: JSON.stringify({
                arr: Array.from({ length: MAX_ARRAY_SIZE + 1 }, (_, i) => i),
            }),
        });

        expect(res.status).toBe(400);
    });

    test("returns 422 if array contains anything other than numbers", async() => {
        const res = await app.request("/algorithms/bubble-sort", {
            method: "POST",
            body: JSON.stringify({
                arr: [5, 1, 3, "Hello World", 22, 3],
            }),
        });

        expect(res.status).toBe(422);
    });

    test("returns 404 on unknown algorithm", async() => {
        const res = await app.request("/algorithms/unknown-algorithm", {
            method: "POST",
            body: JSON.stringify({
                arr: [5, 1, 3, 22, 3],
            }),
        });

        expect(res.status).toBe(404);
    });

    test("returns 200 and sorted result on valid input", async() => {
        const res = await app.request("/algorithms/bubble-sort", {
            method: "POST",
            body: JSON.stringify({
                arr: [-2, 3, 11, 2, 3, 5, 1, 3, 22, 3],
            }),
        });

        const body = await res.json() as SortResult;
        expect(res.status).toBe(200);
        expect(body.result).toEqual([-2, 1, 2, 3, 3, 3, 3, 5, 11, 22]);
        expect(typeof body.time).toBe("number");
        expect(body.time).toBeGreaterThanOrEqual(0);
    });
});

