import { describe, expect, test } from "vitest";
import { elonSort } from "../../../../src/lib/algorithms/sorting/elon-sort.js";

describe.skipIf(process.env.RUN_SLOW !== "1")("elon-sort", () => {
    test("returns array with same length", async() => {
        expect(await elonSort([ 1, 2, 3 ])).toHaveLength(3);
    }, 15_000);

    test("returns array with same elements", async() => {
        const res = await elonSort([ 1, 2, 3 ]);
        expect(res.toSorted((a, b) => a - b)).toEqual([ 1, 2, 3 ]);
    }, 15_000);

    test("returns empty array on empty input", async() => {
        expect(await elonSort([])).toEqual([]);
    }, 15_000);
});
