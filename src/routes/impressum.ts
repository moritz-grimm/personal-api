import { Hono } from "hono";

export const impressum = new Hono();

impressum.get("/", (c) => {
    return c.json(
        {
            impressum: "https://www.moritz-grimm.dev/impressum.html",
        },
    );
});
