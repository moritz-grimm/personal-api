import { describe, expect, test } from "vitest";
import { bubbleSort } from "../../../../src/routes/algorithms/sorting/bubble-sort.js";

describe("bubble-sort", () => {
    test("returns sorted array", () => {
        expect(bubbleSort([3, 2, 1])).toEqual([1, 2, 3]);
    });

    test("returns sorted array if already sorted", () => {
        expect(bubbleSort([1, 2, 3])).toEqual([1, 2, 3]);
    });

    test("returns empty array on empty input", () => {
        expect(bubbleSort([])).toEqual([]);
    });

    test("returns sorted array with negative numbers", () => {
        expect(bubbleSort([- 2, 1, 3, -5, 22])).toEqual([-5, -2, 1, 3, 22]);
    });
});
