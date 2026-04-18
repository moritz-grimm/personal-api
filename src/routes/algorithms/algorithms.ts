import { Hono } from "hono";
import { Errors } from "../../errors.js";
import type { SearchAlgorithms, SearchRequestBody, SortingAlgorithms, SortRequestBody } from "./constants.js";
import { searchAlgorithmMap, sortingAlgorithmMap } from "./constants.js";
import { arrayIsSorted, validateArray } from "./algorithm-utils.js";

const algorithms = new Hono();

algorithms.get("/", (c) => {
    return c.json({
        sorting: Object.fromEntries(
            Object.entries(sortingAlgorithmMap).map(([key, { description }]) => [
                key,
                { href: `/sorting/${key}`, description },
            ]),
        ),
        search: Object.fromEntries(
            Object.entries(searchAlgorithmMap).map(([key, { description }]) => [
                key,
                { href: `/search/${key}`, description },
            ]),
        ),
    });
});

algorithms.post("/sorting/:algorithm", async(c) => {
    const algorithm: SortingAlgorithms = c.req.param("algorithm");
    const body = await c.req.json<SortRequestBody>().catch(() => null);
    if (!body) throw Errors.INVALID_BODY();

    const error = validateArray(c, body.arr);
    if (error) return error;

    const fn = sortingAlgorithmMap[algorithm]?.fn;

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

algorithms.post("/search/:algorithm", async(c) => {
    const algorithm: SearchAlgorithms = c.req.param("algorithm");
    const body = await c.req.json<SearchRequestBody>().catch(() => null);
    if (!body) throw Errors.INVALID_BODY();

    const error = validateArray(c, body.arr);
    if (error) return error;

    if (typeof body.target !== "number") {
        return c.json({
            error: "Target needs to be a number",
        }, 422);
    }

    if (!arrayIsSorted(body.arr)) {
        return c.json({
            error: "Array needs to be sorted in ascending order in order to perform a search",
        }, 422);
    }

    const fn = searchAlgorithmMap[algorithm]?.fn;

    if (!fn) {
        return c.json({
            error: "Unknown algorithm",
        }, 404);
    }

    const start = performance.now();
    const result = fn(body.arr, body.target);
    const end = performance.now();

    return c.json({
        time: end - start,
        result,
    }, 200);
});

export default algorithms;
