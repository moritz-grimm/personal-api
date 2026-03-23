import { Hono } from "hono";

export const privacyPolicy = new Hono();

privacyPolicy.get("/", (c) => {
    return c.json(
        {
            impressum: "https://www.moritz-grimm.dev/privacy-policy.html",
        },
    );
});
