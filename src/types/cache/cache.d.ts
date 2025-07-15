export interface CachedResponse {
  status: number;
  headers: Record<string, string>;
  body: Buffer;
}
