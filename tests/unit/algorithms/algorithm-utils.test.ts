import type { Context } from "hono";
import { describe, expect, test } from "vitest";
import { arrayIsSorted, isNumberArray, validateArray } from "../../../src/algorithms/algorithm-utils.js";
import { MAX_ARRAY_SIZE } from "../../../src/algorithms/constants.js";

describe("isNumberArray", () => {
    test("returns true if array only contains numbers", () => {
        const arr = [ 2, 4, 6, 8, 10 ];
        expect(isNumberArray(arr)).toBe(true);
    });

    test("returns false if array contains something else", () => {
        const arr = [ 2, 4, 6, 8, "hello world" ];
        expect(isNumberArray(arr)).toBe(false);
    });
});

describe("arrayIsSorted", () => {
    test("returns true if array is sorted", () => {
        const arr = [ 2, 4, 6, 8, 10 ];
        expect(arrayIsSorted(arr)).toBe(true);
    });

    test("returns false if array is not sorted", () => {
        const arr = [ 11, 7, 2, 4, 2, 8 ];
        expect(arrayIsSorted(arr)).toBe(false);
    });
});

const mockContext = {
    json: (body: unknown, status: number) => Response.json(body, { status }),
} as unknown as Context;

describe("validateArray", () => {
    test("returns 400 if array is missing", () => {
        const res = validateArray(mockContext, undefined as unknown as Array<unknown>);

        expect(res).not.toBeNull();
    });

    test("returns 400 with error on non-array", () => {
        const arr = "[ 2, 4, 6, 8, 10 ]";
        const res = validateArray(mockContext, arr as unknown as Array<unknown>); // We need to cast here because somebody could send a array as a string in his json

        expect(res).not.toBeNull();
    });

    test("returns 400 if max array size is exceeded", () => {
        const arr = Array.from({ length: MAX_ARRAY_SIZE + 1 }, (_, i) => i);
        const res = validateArray(mockContext, arr);

        expect(res).not.toBeNull();
    });

    test("returns 422 if array contains anything other than numbers", () => {
        const arr = [ 5, 1, 3, "Hello World", 22, 3 ];
        const res = validateArray(mockContext, arr);

        expect(res?.status).toBe(422);
    });

    test("returns null if array is valid", () => {
        const arr = [ 2, 3, 1, 8, 2, 4, 8 ];
        const res = validateArray(mockContext, arr);

        expect(res).toBeNull();
    });
});
