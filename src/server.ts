import "dotenv/config";
import express from "express";
import { createHandler } from "./proxyHandler/proxyHandler.ts";

const HOST = process.env.SERVER_HOST || "localhost";

export function startServer(port: number, origin: string) {
  const app = express();

  const handler = createHandler(origin);
  app.use(handler);

  app.listen(port, HOST, () => {
    console.log(`listening on port ${port}...`);
  });
}
