import { describe, expect, test } from "vitest";
import { bubbleSort } from "../../src/routes/algorithms/bubble-sort.js";

describe("GET /algorithms/bubble-sort", () => {
    test("sorts an unsorted array", () => {
        expect(bubbleSort([3, 2, 1])).toEqual([1, 2, 3]);
    });

    test("handles already sorted array", () => {
        expect(bubbleSort([1, 2, 3])).toEqual([1, 2, 3]);
    });

    test("handles empty array", () => {
        expect(bubbleSort([])).toEqual([]);
    });

    test("handles negative numbers", () => {
        expect(bubbleSort([- 2, 1, 3, -5, 22])).toEqual([-5, -2, 1, 3, 22]);
    });
});
