import { bubbleSort } from "./bubble-sort.js";
import { elonSort } from "./elon-sort.js";
import { selectionSort } from "./selection-sort.js";

export const MAX_ARRAY_SIZE = 2_000;
export type SortRequestBody = {
    arr: Array<number>
};

export const algorithmMap: Record<string, { fn: (arr: number[]) => number[] | Promise<number[]>, description: string }> = {
    "elon-sort": { fn: elonSort, description: "Elon-Sort is a next-gen algorithm designed to eventually sort arrays" },
    "bubble-sort": { fn: bubbleSort, description: "Sorts an array of numbers using the bubble sort algorithm" },
    "selection-sort": { fn: selectionSort, description: "Sorts an array of numbers using the selection sort algorithm" },
};
export type Algorithms = keyof typeof algorithmMap;
