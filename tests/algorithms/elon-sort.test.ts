import { describe, expect, test } from "vitest";
import { elonSort } from "../../src/routes/algorithms/elon-sort.js";

describe("GET /algorithms/elon-sort", () => {
    test("returns array with same length", async() => {
        expect(await elonSort([1, 2, 3])).toHaveLength(3);
    }, 15_000);

    test("returns array with same elements", async() => {
        const res = await elonSort([1, 2, 3]);
        expect(res.toSorted((a, b) => a - b)).toEqual([1, 2, 3]);
    }, 15_000);

    test("handles empty array", async() => {
        expect(await elonSort([])).toEqual([]);
    }, 15_000);
});
