import type { Endpoints } from "@octokit/types";
import { Hono } from "hono";

type Commits = Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"];

export const lastUpdated = new Hono();

const cache = new Map<string, { lastUpdated: string, time :number }>();
const CACHE_TTL = 3600000; // 1h

lastUpdated.get("/:repo?", async(c) => {
    const repo = c.req.param("repo") ?? "personal-api";
    const cached = cache.get(repo);

    if (cached && Date.now() - cached.time < CACHE_TTL) {
        return c.json(cached.lastUpdated);
    }

    const response = await fetch(`https://api.github.com/repos/moritz-grimm/${repo}/commits`);
    if (!response.ok) return c.json({ error: `Repository '${repo}' not found` }, 404);

    const commits = await response.json() as Commits;
    const date = commits[0].commit.committer?.date?.split("T")[0] ?? null;

    if (!date) {
        return c.json({ lastUpdated: "Unknown" });
    }

    cache.set(repo, { lastUpdated: date , time: Date.now() });

    return c.json({ lastUpdated: date });
});
