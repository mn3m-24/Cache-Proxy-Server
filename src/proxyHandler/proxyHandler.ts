import { cacheClient } from "../cache/cache.ts";
import { forwardToOrigin } from "./forwardToOrigin.ts";
import type { Request, Response } from "express";

const CACHE_TTL = process.env.CACHE_TTL || "3600";

export const createHandler = (url: string) => {
  return async (req: Request, res: Response) => {
    const fullUrl = url + (req.url || "/");
    const cachedData = await cacheClient.get(fullUrl);
    if (cachedData) {
      const val = JSON.parse(cachedData);
      return res
        .status(val.status)
        .set({ ...val.headers, "X-Cache": "HIT" })
        .send(Buffer.from(val.body));
    }

    const originRes = await forwardToOrigin(fullUrl);

    try {
      await cacheClient.SETEX(
        fullUrl,
        parseInt(CACHE_TTL),
        JSON.stringify(originRes),
      );
    } catch (err) {
      console.log("Redis Write Error", err);
    }
    return res
      .status(originRes.status)
      .set({ ...originRes.headers, "X-Cache": "MISS" })
      .send(originRes.body);
  };
};
