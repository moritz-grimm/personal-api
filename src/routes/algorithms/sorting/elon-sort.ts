export async function elonSort(arr: Array<number>): Promise<Array<number>> {
    const maxRandomLoop = 100; // Change this as desired
    const timesToLoop = generateRandomInt(1, maxRandomLoop);
    const initialArrayLength = arr.length;

    for (let i = 0; i < timesToLoop; i++) {
        const removedElements = [];
        for (let i = 0; i < initialArrayLength / 2; i++) {
            const randomInt = generateRandomInt(0, arr.length - 1);
            const elementToBeRemoved = arr[randomInt];

            removedElements.push(elementToBeRemoved);
            arr.splice(randomInt, 1);
        }

        arr.push(...removedElements);
        await sleep(timesToLoop);
    }

    return arr;
}

function generateRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
