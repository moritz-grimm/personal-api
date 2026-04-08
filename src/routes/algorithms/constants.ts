import { bubbleSort } from "./bubble-sort.js";
import { elonSort } from "./elon-sort.js";

export type SortRequestBody = {
    arr: Array<number>
};
export const algorithMap: Record<string, (arr: number[]) => number[] | Promise<number[]>> = {
    "elon-sort": elonSort,
    "bubble-sort": bubbleSort,
};
export type Algorithms = keyof typeof algorithMap;
