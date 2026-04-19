import { describe, expect, test } from "vitest";
import { searchAlgorithmMap, sortingAlgorithmMap } from "../../src/algorithms/constants.js";
import app from "../../src/app.js";

type Result = {
    time: number,
    result: Array<number>
};

describe("GET /algorithms", () => {
    test("returns list of every available algorithm", async() => {
        const expectedRes = {
            sorting: Object.fromEntries(
                Object.entries(sortingAlgorithmMap).map(([key, { description }]) => [
                    key,
                    { href: `/sorting/${key}`, description },
                ]),
            ),
            search: Object.fromEntries(
                Object.entries(searchAlgorithmMap).map(([key, { description }]) => [
                    key,
                    { href: `/search/${key}`, description },
                ]),
            ),
        };

        const res = await app.request("/algorithms");

        expect(await res.json()).toEqual(expectedRes);
    });
});

describe("POST /algorithms/sorting/:algorithm", () => {
    test("returns 404 on unknown algorithm", async() => {
        const res = await app.request("/algorithms/sorting/unknown-algorithm", {
            method: "POST",
            body: JSON.stringify({
                arr: [5, 1, 3, 22, 3],
            }),
        });

        expect(res.status).toBe(404);
    });

    test("returns 200 and sorted result on valid input", async() => {
        const res = await app.request("/algorithms/sorting/bubble-sort", {
            method: "POST",
            body: JSON.stringify({
                arr: [-2, 3, 11, 2, 3, 5, 1, 3, 22, 3],
            }),
        });

        const body = await res.json() as Result;
        expect(res.status).toBe(200);
        expect(body.result).toEqual([-2, 1, 2, 3, 3, 3, 3, 5, 11, 22]);
        expect(typeof body.time).toBe("number");
        expect(body.time).toBeGreaterThanOrEqual(0);
    });
});

describe("POST /algorithms/search/:algorithm", () => {
    test("returns 404 on unknown algorithm", async() => {
        const res = await app.request("/algorithms/search/unknown-algorithm", {
            method: "POST",
            body: JSON.stringify({
                arr: [1, 2, 3, 4, 5],
                target: 5,
            }),
        });

        expect(res.status).toBe(404);
    });

    test("returns 200 and sorted result on valid input", async() => {
        const arr = [-2, 4, 6, 8, 10, 12, 14, 16];
        const target = 10;
        const res = await app.request("/algorithms/search/binary-search", {
            method: "POST",
            body: JSON.stringify({
                arr: arr,
                target: target,
            }),
        });

        const body = await res.json() as Result;
        expect(res.status).toBe(200);
        expect(body.result).toBe(arr.indexOf(target));
        expect(typeof body.time).toBe("number");
        expect(body.time).toBeGreaterThanOrEqual(0);
    });
});
