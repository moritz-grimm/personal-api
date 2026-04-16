export function selectionSort(arr: Array<number>): Array<number> {
    const max = Math.max(...arr);
    let threshold = -Infinity;
    let currentSmallestNumIndex = 0;

    while (true) {
        const next = nextGreaterNum(arr, threshold);
        moveElement(arr, arr.indexOf(next), currentSmallestNumIndex);
        currentSmallestNumIndex++;
        threshold = next;

        if (threshold === max) break;
    }

    return arr;
};

function moveElement(input: Array<number>, from: number, to: number): Array<number> {
    const element = input.splice(from, 1);
    input.splice(to, 0, ...element);

    return input;
}

function nextGreaterNum(arr: Array<number>, threshold: number): number {
    return arr.reduce((min, n) => {
        if (n > threshold && (min === Infinity || n < min)) {
            return n;
        }
        return min;
    }, Infinity);
}
