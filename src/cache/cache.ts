import { createClient } from "redis";
import "dotenv/config";

export const cacheClient = createClient({
  url: process.env.CACHE_URL,
});

cacheClient.on("error", (err) => console.error("Redis Client Error", err));

await cacheClient.connect();
