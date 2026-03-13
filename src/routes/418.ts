import { Hono } from "hono";

const fourhundredeighteen = new Hono();

fourhundredeighteen.get("/", (c) => {
    return c.text("I'm a teapot", 418);
});

fourhundredeighteen.post("/", (c) => {
    return c.text("Started brewing coffee", 418);
});

export default fourhundredeighteen;
