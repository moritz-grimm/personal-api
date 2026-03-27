import { Hono } from "hono";

export const privacyPolicy = new Hono();

privacyPolicy.get("/", (c) => {
    return c.json(
        {
            privacyPolicy: "https://www.moritz-grimm.dev/privacy-policy.html",
        },
    );
});
