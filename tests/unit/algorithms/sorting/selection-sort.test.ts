import { describe, expect, test } from "vitest";
import { selectionSort } from "../../../../src/routes/algorithms/sorting/selection-sort.js";

describe("selection-sort", () => {
    test("returns sorted array", () => {
        expect(selectionSort([3, 2, 1])).toEqual([1, 2, 3]);
    });

    test("returns sorted array if already sorted", () => {
        expect(selectionSort([1, 2, 3])).toEqual([1, 2, 3]);
    });

    test("returns empty array on empty input", () => {
        expect(selectionSort([])).toEqual([]);
    });

    test("returns sorted array with negative numbers", () => {
        expect(selectionSort([- 55, 1, 2, -7, 11])).toEqual([-55, -7, 1, 2, 11]);
    });
});
