import { Hono } from "hono";

const info = new Hono;

info.get("/", (c) => {
    return c.text("Hello! My name is Moritz :)");
});

export default info;
