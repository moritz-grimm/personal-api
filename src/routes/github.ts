import type { Endpoints } from "@octokit/types";
import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { existsSync } from "node:fs";
import path from "node:path";

// TODO: Implement cache here

type RepoListResponse = Endpoints["GET /users/{username}/repos"]["response"]["data"];
type UserReponse = Endpoints["GET /user"]["response"]["data"];
type Format = "json" | "text";
const envPath = path.join(process.cwd(), ".env");
if (existsSync(envPath)) {
    process.loadEnvFile(envPath);
}

const github = new Hono();

github.get("/:user?", async(c) => {
    const format = c.req.query("format") as Format;
    const userParam = c.req.param("user") ?? "moritz-grimm";

    if (format !== "json" && format !== "text") {
        return c.text("Invalid format. Use 'json' or 'text'.", 400);
    }

    const githubToken = process.env.GITHUB_TOKEN;
    let userResponse;
    if (userParam === "moritz-grimm") {
        userResponse = await fetch("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${githubToken}` },
        });
    } else {
        userResponse = await fetch(`https://api.github.com/users/${userParam}`, {
            headers: { Authorization: `Bearer ${githubToken}` },
        });
    }
    const reposResponse = await fetch(`https://api.github.com/users/${userParam}/repos`, {
        headers: { Authorization: `Bearer ${githubToken}` },
    });

    if (!userResponse.ok) {
        return c.text("API Response Error: " + userResponse.status, userResponse.status as ContentfulStatusCode);
    }
    if (!reposResponse.ok) {
        return c.text("API Response Error: " + reposResponse.status, reposResponse.status as ContentfulStatusCode);
    }

    const repos = await reposResponse.json() as RepoListResponse;
    const user = await userResponse.json() as UserReponse;
    const starCount = repos.reduce((sum, repo) => sum + (repo.stargazers_count ?? 0), 0);
    const langCounts = repos.reduce((acc, repo) => {
        if (repo.language) acc[repo.language] = (acc[repo.language] ?? 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topLanguages = Object.entries(langCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([ lang ]) => lang);

    if (format === "text") {
        return c.text(`Hi, I'm ${user.name}, a developer based in ${user.location}.
You can reach me at ${user.email} or find me on GitHub at ${user.html_url}.
I maintain ${user.public_repos} public repositories with a combined ${starCount} stars.
My most used languages are ${topLanguages.join(", ")}.`);
    }

    return c.json(
        {
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
        },
    );
});

export default github;
