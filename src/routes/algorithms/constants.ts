import { bubbleSort } from "./bubble-sort.js";
import { elonSort } from "./elon-sort.js";
import { selectionSort } from "./selection-sort.js";

export const MAX_ARRAY_SIZE = 2_000;
export type SortRequestBody = {
    arr: Array<number>
};
export const algorithMap: Record<string, (arr: number[]) => number[] | Promise<number[]>> = {
    "elon-sort": elonSort,
    "bubble-sort": bubbleSort,
    "selection-sort": selectionSort,
};
export type Algorithms = keyof typeof algorithMap;
