import express, { Response, Request } from "express";

const app = express();

app.get("/", (_: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Hi");
});
