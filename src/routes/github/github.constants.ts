import type { Endpoints } from "@octokit/types";

export type RepoListResponse = Endpoints["GET /users/{username}/repos"]["response"]["data"];
export type UserResponse = Endpoints["GET /user"]["response"]["data"];
export type Format = "json" | "text";
export type Cache = {
    user: UserResponse;
    starCount: number;
    topLanguages: Array<string>;
};

export const TTL = 3600; // 1h
export const EXCLUDED_LANGUAGES = new Set([ "PowerShell" ]); // Exclude PowerShell: skews top languages due to one public repos despite minimal experience
