import { describe, expect, test } from "vitest";
import app from "../../src/app.js";
import { ALLOWED_ADDITIONS, AVAILABLE_POTS, POT_INFO, potStates } from "../../src/routes/418/constants.js";

describe("GET /418", () => {
    test("returns 200 with HTCPCP protocol info", async() => {
        const res = await app.request("/418");
        const body = await res.text();

        expect(res.status).toBe(200);
        expect(body).toBe("HTCPCP/1.0 - Hyper Text Coffee Pot Control Protocol");
    });
});

describe("GET /418/:pot", () => {
    test("returns 404 with error message on unknown pot", async() => {
        const pot = "pot-404";
        const res = await app.request(`/418/${pot}`);

        expect(res.status).toBe(404);
        expect(await res.text()).toBe(`"${pot}" not found`);
    });

    test("returns 418 with teapot message on teapot", async() => {
        const res = await app.request("/418/teapot-1");

        expect(res.status).toBe(418);
        expect(await res.text()).toBe("I'm a teapot");
    });

    test("returns coffee status for available pots", async() => {
        for (const pot of AVAILABLE_POTS) {
            const res = await app.request(`/418/${pot}`);
            const body = await res.text();

            expect([ 200, 403 ]).toContain(res.status);
            expect([ "No coffee available", `Enjoy your coffee from ${pot}` ]).toContain(body);
        }
    });
});

describe("POST /418/:pot", () => {
    test("returns 404 if no pot is given", async() => {
        const res = await app.request("/418", {
            method: "POST",
        });

        expect(res.status).toBe(404);
    });

    test("returns 404 with error message if pot is not found", async() => {
        const pot = "pot-404";
        const res = await app.request(`/418/${pot}`, {
            method: "POST",
        });

        expect(res.status).toBe(404);
        expect(await res.text()).toBe(`"${pot}" not found`);
    });

    test("returns 418 with teapot message on teapot", async() => {
        const res = await app.request("/418/teapot-1", {
            method: "POST",
        });

        expect(res.status).toBe(418);
        expect(await res.text()).toBe("I'm a teapot");
    });

    test("returns 415 on wrong media type", async() => {
        for (const pot of AVAILABLE_POTS) {
            const res = await app.request(`/418/${pot}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            expect(res.status).toBe(415);
        }
    });

    test("returns 503 with message if coffee pot is not operational", async() => {
        const res = await app.request("/418/pot-3", {
            method: "POST",
            headers: {
                "Content-Type": "message/coffeepot",
            },
        });

        expect(res.status).toBe(503);
        expect(await res.text()).toBe("Coffee pot is temporarily out of service");
    });

    test("returns 403 with message if coffee pot is out of water or coffee", async() => {
        const res = await app.request("/418/pot-2", {
            method: "POST",
            headers: {
                "Content-Type": "message/coffeepot",
            },
        });

        expect(res.status).toBe(403);
        expect(await res.text()).toBe("Coffee pot is empty");
    });

    test("returns 406 with message if given addition is not valid", async() => {
        const addition = "oat-milk";
        const res = await app.request("/418/pot-1", {
            method: "POST",
            headers: {
                "Content-Type": "message/coffeepot",
                "Accept-Additions": addition,
            },
        });

        expect(res.status).toBe(406);
        expect(await res.text()).toBe(`Desired additions are not available: "${addition}". \nAvailable additions: ${ALLOWED_ADDITIONS.join(", ")}`);
    });

    test("returns 406 with message if one of multiple additions is not valid", async() => {
        const additions = "sugar, oat-milk";
        const invalidAddition = "oat-milk";
        const res = await app.request("/418/pot-1", {
            method: "POST",
            headers: {
                "Content-Type": "message/coffeepot",
                "Accept-Additions": additions,
            },
        });

        expect(res.status).toBe(406);
        expect(await res.text()).toBe(`Desired additions are not available: "${invalidAddition}". \nAvailable additions: ${ALLOWED_ADDITIONS.join(", ")}`);
    });

    test("returns 200 with confirmation without additions", async() => {
        const res = await app.request("/418/pot-1", {
            method: "POST",
            headers: {
                "Content-Type": "message/coffeepot",
            },
        });

        expect(res.status).toBe(200);
        expect(await res.text()).toBe("Started brewing coffee");
    });

    test("returns 200 with confirmation with additions", async() => {
        const res = await app.request("/418/pot-1", {
            method: "POST",
            headers: {
                "Content-Type": "message/coffeepot",
                "Accept-Additions": "cream, sugar",
            },
        });

        expect(res.status).toBe(200);
        expect(await res.text()).toBe("Started brewing coffee");
    });
});

describe("PROPFIND /418/:pot", () => {
    test("returns 200 with pot info for available pots", async() => {
        for (const pot of AVAILABLE_POTS) {
            const res = await app.request(`/418/${pot}`, {
                method: "PROPFIND",
            });
            const info = POT_INFO[pot];

            expect(res.status).toBe(200);
            expect(await res.json()).toMatchObject({
                ...info,
                availableAdditions: ALLOWED_ADDITIONS,
                status: potStates.get(pot)!,
                brewerVersion: "HTCPCP/1.0",
            });
        }
    });

    test("returns 404 with error message on unknown pot", async() => {
        const pot = "pot-404";
        const res = await app.request(`/418/${pot}`, {
            method: "PROPFIND",
        });

        expect(res.status).toBe(404);
        expect(await res.text()).toBe(`"${pot}" not found`);
    });
});
