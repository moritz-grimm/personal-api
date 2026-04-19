import { describe, expect, test } from "vitest";
import { binarySearch } from "../../../../src/algorithms/search/binary-search.js";

describe("binarySearch", () => {
    test("returns index of target", () => {
        const arr = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
        const res = binarySearch(arr, 16);

        expect(res).toBe(arr.indexOf(16));
    });

    test("returns -1 if target not in array", () => {
        const res = binarySearch([2, 4, 6, 8, 10, 12, 14, 18, 20], 16);

        expect(res).toBe(-1);
    });

    test("returns -1 on empty array", () => {
        const res = binarySearch([], 16);

        expect(res).toBe(-1);
    });
});
