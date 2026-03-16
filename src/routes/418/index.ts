import { Hono } from "hono";
import { ALLOWED_ADDITIONS, AVAILABLE_POTS, potStates, type AllowedAdditions, type AvailablePots, type PotInfo } from "./constants.js";

const fourhundredeighteen = new Hono();

fourhundredeighteen.use("*", async(c, next) => {
    await next();
    if (!c.res.headers.get("Content-Type")?.includes("application/json")) {
        c.header("Content-Type", "message/coffeepot");
    }
});

fourhundredeighteen.use("/:pot", async(c, next) => {
    const pot = c.req.param("pot");
    if (pot.includes("teapot")) {
        return c.text("I'm a teapot", 418);
    }
    if (!AVAILABLE_POTS.includes(pot as AvailablePots)) {
        return c.text(`"${pot}" not found`, 404);
    }

    await next();
});

fourhundredeighteen.get("/", (c) => {
    return c.text("HTCPCP/1.0 - Hyper Text Coffee Pot Control Protocol", 200);
});

fourhundredeighteen.get("/:pot", (c) => {
    const pot = c.req.param("pot") as AvailablePots;
    const potState = potStates.get(pot)!;

    if (!potState.hasCoffee) {
        return c.text("No coffee available", 403);
    }

    return c.text(`Enjoy your coffee from ${pot}`);
});

fourhundredeighteen.post("/:pot", (c) => {
    const contentType = c.req.header("Content-Type");
    if (contentType !== "message/coffeepot") {
        return c.text("Unsupported Media Type", 415);
    }

    const pot = c.req.param("pot") as AvailablePots;
    const potState = potStates.get(pot)!;

    if (!potState.isOperational) {
        return c.text("Coffee pot is temporarily out of service", 503);
    }
    if (!potState.hasWater || !potState.hasCoffee) {
        return c.text("Coffee pot is empty", 403);
    }

    let acceptAdditions = c.req.header("Accept-Additions");
    acceptAdditions = acceptAdditions?.trim();
    acceptAdditions = acceptAdditions?.replaceAll(/=\d+/g, "").replaceAll(/\s/g, ""); // Strip header of amount e.g. sugar=2 => sugar & whitespaces
    const acceptAdditionsArray = acceptAdditions?.split(",");

    if (acceptAdditionsArray) {
        for (const addition of acceptAdditionsArray) {
            if (!ALLOWED_ADDITIONS.includes(addition as AllowedAdditions)) {
                return c.text(`Desired additions are not available: "${addition}". \nAvailable additions: ${ALLOWED_ADDITIONS.join(", ")}`, 406);
            }
        }
    }


    return c.text("Started brewing coffee", 200);
});

fourhundredeighteen.on("PROPFIND", "/:pot", (c) => {
    const pot = c.req.param("pot") as AvailablePots;

    if (pot === "pot-1") {
        return c.json<PotInfo>({
            name: "Brühhilde",
            age: "4",
            capacity: "1.5L",
            availableAdditions: ALLOWED_ADDITIONS,
            status: potStates.get(pot)!,
            brewerVersion: "HTCPCP/1.0",
        }, 200);
    }
    if (pot === "pot-2") {
        return c.json<PotInfo>({
            name: "Sir Brews-a-Lot",
            age: "12",
            capacity: "0.8L",
            availableAdditions: ALLOWED_ADDITIONS,
            status: potStates.get(pot)!,
            brewerVersion: "HTCPCP/1.0",
        }, 200);
    }
    if (pot === "pot-3") {
        return c.json<PotInfo>({
            name: "Brewbacca",
            age: "6",
            capacity: "4.2L",
            availableAdditions: ALLOWED_ADDITIONS,
            status: potStates.get(pot)!,
            brewerVersion: "HTCPCP/1.0",
        }, 200);
    }

    return c.text("Pot not found", 404);
});

export default fourhundredeighteen;
