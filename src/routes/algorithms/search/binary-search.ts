export function binarySearch(arr: Array<number>, target: number): number {
    let low = 0;
    let high = arr.length - 1;
    let mid;
    while (high >= low) {
        mid = low + Math.floor((high - low) / 2);

        if (arr[mid] === target) return mid;

        if (arr[mid] < target) low = mid + 1;

        if (arr[mid] > target) high = mid - 1;
    }

    return -1;
};
