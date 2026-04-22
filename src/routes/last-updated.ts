import type { Endpoints } from "@octokit/types";
import { Hono } from "hono";
import { cacheGet, cacheSet } from "../lib/redis.js";

type Commits = Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"];

const lastUpdated = new Hono();

const TTL = 3600; // 1h

lastUpdated.get("/:repo?", async(c) => {
    const repo = c.req.param("repo") ?? "personal-api";
    const cached = await cacheGet(repo);

    if (cached) return c.json({ lastUpdated: cached });

    const response = await fetch(`https://api.github.com/repos/moritz-grimm/${repo}/commits`);
    if (!response.ok) return c.json({ error: `Repository '${repo}' not found` }, 404);

    const commits = await response.json() as Commits;
    const date = commits[0].commit.committer?.date?.split("T")[0] ?? null;

    if (!date) {
        return c.json({ lastUpdated: "Unknown" });
    }

    await cacheSet(repo, date, TTL);

    return c.json({ lastUpdated: date });
});

export default lastUpdated;
