import { Command } from "commander";
import { cacheClient } from "./cache/cache.ts";
import { startServer } from "./server.ts";

const program = new Command();

program
  .name("caching-proxy")
  .description("Caching proxy server")
  .version("0.0.1");

program
  .option("-p, --port <number>", "Server port number", parseInt)
  .option("-o, --origin <url>", "Url to request")
  .option("-l, --list-cache", "List all of the cache keys")
  .option("--clear-cache", "Clear the proxy cache");

program.parse(process.argv);

const options = program.opts();

if (
  options.clearCache &&
  !options.port &&
  !options.origin &&
  !options.listCache
) {
  await cacheClient.flushAll();
  console.log("Cache is cleared");
  process.exit(0);
} else if (
  options.port &&
  options.origin &&
  !options.clearCache &&
  !options.listCache
) {
  if (options.port > 65535 || options.port < 0)
    throw new Error("Invalid Port number");

  startServer(options.port, options.origin);
} else if (
  options.listCache &&
  !options.port &&
  !options.origin &&
  !options.clearCache
) {
  console.log((await cacheClient.KEYS("*")).join("\n"));
  process.exit(0);
} else {
  console.error("Invalid options or arguments");
  process.exit(1);
}
