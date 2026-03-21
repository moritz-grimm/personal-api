import { cors } from "hono/cors";

export const corsMiddleware = cors({
    origin: ["https://moritz-grimm.dev", "http://localhost:3000", "http://localhost:5173"], // 5173 because it's the default Vite port
});
