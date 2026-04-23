import { Hono, type Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { namespacedCache } from "../../lib/redis.js";
import { EXCLUDED_LANGUAGES, TTL, type Cache, type Format, type RepoListResponse, type UserResponse } from "./github.constants.js";

const github = new Hono();

const cache = namespacedCache("github");

github.get("/:user?", async(c) => {
    const format = c.req.query("format") as Format;
    const userParam = c.req.param("user") ?? "moritz-grimm";
    const cached = await cache.get(userParam);

    if (format !== "json" && format !== "text") return c.text("Invalid format. Use 'json' or 'text'.", 400);

    if (cached) {
        const { user, starCount, topLanguages } = JSON.parse(cached) as Cache;
        return respond(c, format, user, starCount, topLanguages);
    }

    const githubToken = process.env.GITHUB_TOKEN;
    const userResponse = await fetch(`https://api.github.com/users/${userParam}`, {
        headers: { Authorization: `Bearer ${githubToken}` },
    });
    const reposResponse = await fetch(`https://api.github.com/users/${userParam}/repos`, {
        headers: { Authorization: `Bearer ${githubToken}` },
    });

    if (!userResponse.ok) return c.text("API Response Error: " + userResponse.status, userResponse.status as ContentfulStatusCode);
    if (!reposResponse.ok) return c.text("API Response Error: " + reposResponse.status, reposResponse.status as ContentfulStatusCode);

    const repos = await reposResponse.json() as RepoListResponse;
    const user = await userResponse.json() as UserResponse;
    const starCount = repos.reduce((sum, repo) => sum + (repo.stargazers_count ?? 0), 0);
    const langCounts = repos.reduce((acc, repo) => {
        if (repo.language && !EXCLUDED_LANGUAGES.has(repo.language)) acc[repo.language] = (acc[repo.language] ?? 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topLanguages = Object.entries(langCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([ lang ]) => lang);

    await cache.set(user.login, JSON.stringify({ user, starCount, topLanguages }), TTL);

    return respond(c, format, user, starCount, topLanguages);
});

export default github;

function respond(c: Context, format: Format, user: UserResponse, starCount: number, topLanguages: Array<string>): Response {
    if (format === "text") {
        return textResponse(c, user, starCount, topLanguages);
    }

    return jsonResponse(c, user, starCount, topLanguages);
}

function jsonResponse(c: Context, user: UserResponse, starCount: number, topLanguages: Array<string>): Response {
    return c.json({
        name: user.name,
        email: user.email,
        location: user.location,
        bio: user.bio,
        profileUrl: user.html_url,
        createdAt: user.created_at,
        topLanguages: topLanguages,
        followerCount: user.followers,
        publicRepos: user.public_repos,
        totalStarCount: starCount,
    });
}

function textResponse(c: Context, user: UserResponse, starCount: number, topLanguages: Array<string>): Response {
    return c.text(`Hi, I'm ${user.name}, a developer based in ${user.location}.
You can reach me at ${user.email} or find me on GitHub at ${user.html_url}.
I maintain ${user.public_repos} public repositories with a combined ${starCount} stars.
My most used languages are ${topLanguages.join(", ")}.`);
}
