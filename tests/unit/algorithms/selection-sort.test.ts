import { describe, expect, test } from "vitest";
import { selectionSort } from "../../../src/routes/algorithms/selection-sort.js";

describe("GET /algorithms/selection-sort", () => {
    test("sorts an unsorted array", () => {
        expect(selectionSort([3, 2, 1])).toEqual([1, 2, 3]);
    });

    test("handles already sorted array", () => {
        expect(selectionSort([1, 2, 3])).toEqual([1, 2, 3]);
    });

    test("handles empty array", () => {
        expect(selectionSort([])).toEqual([]);
    });

    test("handles negative numbers", () => {
            expect(selectionSort([- 55, 1, 2, -7, 11])).toEqual([-55, -7, 1, 2, 11]);
    });
});
