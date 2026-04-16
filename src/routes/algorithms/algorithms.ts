import { Hono } from "hono";
import { algorithMap, MAX_ARRAY_SIZE, type Algorithms, type SortRequestBody } from "./constants.js";

const algorithms = new Hono();

algorithms.get("/", (c) => {
    return c.json({
        elonSort: { href: "/elon-sort", description: "Elon-Sort is a next-gen algorithm designed to eventually sort arrays" },
        bubbleSort: { href: "/bubble-sort", description: "Sorts an array of numbers using the bubble sort algorithm" },
    });
});

algorithms.post("/:algorithm?", async(c) => {
    const algorithm = c.req.param("algorithm") as Algorithms;
    const body = await c.req.json<SortRequestBody>().catch(() => null);
    if (!body) return c.json({ error: "Invalid or missing body" }, 400);

    if (!algorithm) {
        return c.json({
            error: "No algorithm provided",
        }, 422);
    }

    if (!Array.isArray(body.arr)) {
        return c.json({
            error: "Body needs to contain a array",
        }, 400);
    }

    if (body.arr.length > MAX_ARRAY_SIZE) return c.json({ error: "Max array size exceeded" }, 400);

    if (!onlyNumbers(body.arr)) {
        return c.json({
            error: "Array should only contain numbers",
        }, 422);
    }

    const fn = algorithMap[algorithm];

    if (!fn) {
        return c.json({
            error: "Unknown algorithm",
        }, 404);
    }

    const start = performance.now();
    const result = await fn(body.arr);
    const end = performance.now();

    return c.json({
        time: end - start,
        result,
    }, 200);
});

export default algorithms;

function onlyNumbers(arr: Array<unknown>): boolean {
    return arr.every(element => {
        return typeof element === "number";
    });
}
