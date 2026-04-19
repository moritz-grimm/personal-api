import { binarySearch } from "./search/binary-search.js";
import { bubbleSort } from "./sorting/bubble-sort.js";
import { elonSort } from "./sorting/elon-sort.js";
import { selectionSort } from "./sorting/selection-sort.js";

export const MAX_ARRAY_SIZE = 2_000;
export type SortRequestBody = {
    arr: Array<number>;
};
export type SearchRequestBody = {
    arr: Array<number>;
    target: number;
};

type SortingAlgorithmMap = Record<string, {
    fn: (arr: number[]) =>
        number[] | Promise<number[]>;
    description: string;
}>;

type SearchAlgorithmMap = Record<string, {
    fn: (arr: Array<number>, target: number) => number;
    description: string;
}>;

export const sortingAlgorithmMap: SortingAlgorithmMap = {
    "elon-sort": { fn: elonSort, description: "Elon-Sort is a next-gen algorithm designed to eventually sort arrays" },
    "bubble-sort": { fn: bubbleSort, description: "Sorts an array of numbers using the bubble sort algorithm" },
    "selection-sort": { fn: selectionSort, description: "Sorts an array of numbers using the selection sort algorithm" },
};
export const searchAlgorithmMap: SearchAlgorithmMap = {
    "binary-search": { fn: binarySearch, description: "Search through a sorted array with binary search" },
};

export type SortingAlgorithms = keyof typeof sortingAlgorithmMap;
export type SearchAlgorithms = keyof typeof searchAlgorithmMap;
