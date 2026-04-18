import { Hono } from "hono";
import app from "../app.js";

type Route = {
    basePath: string,
    path: string,
    method: string,
};

const api = new Hono();

api.get("/", (c) => {
    const appRoutes: Route[] = app.routes;
    const routes = new Set<string>();

    appRoutes.forEach(route => {
        routes.add(route.basePath);
    });

    const exclude = new Set(["/", "/fourhundredeighteen"]);
    const paths = [...routes].filter(path => !exclude.has(path));

    return c.json(
        Object.fromEntries(paths.map(path => [path.slice(1), { href: path }])),
    );
});

export default api;
