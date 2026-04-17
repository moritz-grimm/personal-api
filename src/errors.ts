import { HTTPException } from "hono/http-exception";

export const Errors = {
    INVALID_BODY: () => new HTTPException(400, { message: "Invalid or missing body" }),
} as const;
