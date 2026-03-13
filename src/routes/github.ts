import { Hono } from "hono";
import type { Endpoints } from "@octokit/types";
import { loadEnvFile } from "node:process";
import path from "node:path";

type RepoListResponse = Endpoints["GET /users/{username}/repos"]["response"]["data"];
type UserReponse = Endpoints["GET /user"]["response"]["data"];
type Format = "json" | "text";
loadEnvFile(path.join(process.cwd(), ".env"));

const github = new Hono();

github.get("/", async(c) => {
    const format = c.req.query("format") as Format;

    if (format !== "json" && format !== "text") {
        return c.text("Invalid format. Use 'json' or 'text'.", 400);
    }

    const githubToken = process.env.GITHUB_TOKEN;
    const userReponse = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${githubToken}` },
    });
    const reposResponse = await fetch("https://api.github.com/users/moritz-grimm/repos", {
        headers: { Authorization: `Bearer ${githubToken}` },
    });

    if (!reposResponse.ok || !userReponse.ok) {
        return c.text("API Response Error: " + reposResponse.status);
    }

    const repos = await reposResponse.json() as RepoListResponse;
    const user = await userReponse.json() as UserReponse;
    const starCount = repos.reduce((sum, repo) => sum + (repo.stargazers_count ?? 0), 0);
    const langCounts = repos.reduce((acc, repo) => {
        if (repo.language) acc[repo.language] = (acc[repo.language] ?? 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topLanguages = Object.entries(langCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([lang]) => lang);

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
