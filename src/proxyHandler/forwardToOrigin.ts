import type { CachedResponse } from "../types/cache/cache.d.ts";

export async function forwardToOrigin(
  fullUrl: string,
): Promise<CachedResponse> {
  const fetchRes = await fetch(fullUrl, { method: "GET", redirect: "follow" });
  const resArrBuff = await fetchRes.arrayBuffer();
  const resBuff = Buffer.from(resArrBuff);
  const headers = Object.fromEntries(fetchRes.headers);

  ["transfer-encoding", "content-length", "content-encoding"].forEach(
    (header) => delete headers[header],
  ); // remove compression headers that breaks the website

  const val = {
    status: fetchRes.status,
    headers: {
      ...headers,
      "X-Proxy-Url": fullUrl,
    },
    body: resBuff,
  };
  return val;
}
