import type { Context } from "hono";
import { MAX_ARRAY_SIZE } from "./constants.js";

export function isNumberArray(arr: Array<unknown>): boolean {
    return arr.every(element => {
        return typeof element === "number";
    });
}

export function arrayIsSorted(arr: Array<number>): boolean {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > arr[i + 1]) return false;
    };

    return true;
}

export function validateArray(c: Context, arr: Array<unknown>): Response | null {
    if (!Array.isArray(arr)) {
        return c.json({
            error: "Body needs to contain a array",
        }, 400);
    }

    if (arr.length > MAX_ARRAY_SIZE) return c.json({ error: "Max array size exceeded" }, 400);

    if (!isNumberArray(arr)) {
        return c.json({
            error: "Array should only contain numbers",
        }, 422);
    }

    return null;
};
