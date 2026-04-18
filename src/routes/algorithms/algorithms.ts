import { Hono } from "hono";
import { algorithmMap, MAX_ARRAY_SIZE, type Algorithms, type SortRequestBody } from "./constants.js";
import { Errors } from "../../errors.js";

const algorithms = new Hono();

algorithms.get("/", (c) => {
    return c.json(Object.fromEntries(
        Object.entries(algorithmMap).map(([key, { description }]) => [
            key,
            { href: `/${key}`, description },
        ]),
    ));
});

algorithms.post("/:algorithm", async(c) => {
    const algorithm: Algorithms = c.req.param("algorithm");
    const body = await c.req.json<SortRequestBody>().catch(() => null);
    if (!body) throw Errors.INVALID_BODY();

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

    const fn = algorithmMap[algorithm]?.fn;

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
