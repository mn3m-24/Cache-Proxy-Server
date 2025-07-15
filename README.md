# Caching Proxy Server

## Overview

This is a Node.js-based caching proxy server built with Express and Redis. It forwards HTTP GET requests to a specified origin URL, caches the responses in Redis, and serves cached content when available to reduce latency and load on the origin server.

## Features

- **Caching**: Stores responses in Redis with a configurable TTL (default: 3600 seconds).
- **Proxying**: Forwards requests to the specified origin URL and handles responses.
- **Cache Management**: Supports listing and clearing cache keys via CLI commands.
- **TypeScript**: Written in TypeScript for type safety and better developer experience.
- **Environment Configuration**: Uses `.env` for configuration (e.g., Redis URL, server host, cache TTL).

## Prerequisites

- **Node.js**: Version 18 or higher (ESM support required).
- **pnpm**: Version 10.13.1 or compatible (used as the package manager).
- **Redis**: A running Redis instance (local or remote).
- **TypeScript**: For compiling the source code.

## Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd cache-proxy-server
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Set up environment variables**: Create a `.env` file in the root directory and configure the following:

   ```env
   SERVER_HOST=<server_host>
   CACHE_URL=redis://<redis_host>:<redis_port>
   CACHE_TTL=<custom_ttl>
   ```

4. **Build the project**:

   ```bash
   pnpm build
   ```

## Usage

### Starting the Server

Run the server with a specified port and origin URL:

make sure the redis server is running,
cd to the dir of the project then, 

```bash
pnpm ts-node ./src/index.ts --port 3000 --origin http://dummyjson.com
```

This starts the proxy server on `localhost:3000`, forwarding requests to `http://dummyjson.com`.

### Development Mode

For development with automatic restarts on file changes:

```bash
pnpm ts-node ./src/index.ts --port 3000 --origin http://dummyjson.com
```

### Cache Management

- **List cache keys**:

  ```bash
  pnpm ts-node ./src/index.ts --list-cache
  ```

  Displays all keys stored in the Redis cache.

- **Clear cache**:

  ```bash
  pnpm ts-node ./src/index.ts --clear-cache
  ```

  Clears all cached data in Redis.

### Example

To proxy requests to `http://example.com` on port 3000:

```bash
pnpm ts-node ./src/index.ts -p 3000 -o http://example.com
```

Requests to `http://localhost:3000/path` will be forwarded to `http://example.com/path`, with responses cached in Redis.

## Project Structure

```
.
├── package.json              # Project metadata and dependencies
├── pnpm-lock.yaml           # Lockfile for pnpm
├── src                      # Source code
│   ├── cache
│   │   └── cache.ts         # Redis client setup
│   ├── index.ts             # CLI entry point and server initialization
│   ├── proxyHandler
│   │   ├── forwardToOrigin.ts # Logic to fetch from origin
│   │   └── proxyHandler.ts  # Express middleware for caching and proxying
│   ├── server.ts            # Express server setup
│   └── types
│       └── cache
│           └── cache.d.ts   # TypeScript type definitions
└── tsconfig.json            # TypeScript configuration
```

## Dependencies

- **express**: Web framework for handling HTTP requests.
- **redis**: Client for interacting with Redis.
- **commander**: CLI argument parsing.
- **dotenv**: Loads environment variables from `.env`.

## Dev Dependencies

- **typescript**: TypeScript compiler.
- **ts-node**: Runs TypeScript directly.
- **@types/express**, **@types/node**: Type definitions for Express and Node.js.

## Configuration

- **SERVER_HOST**: Hostname for the server (default: `localhost`).
- **CACHE_URL**: Redis connection URL (e.g., `redis://localhost:6379`).
- **CACHE_TTL**: Cache expiration time in seconds (default: `3600`).

## Error Handling

- Invalid port numbers (&lt;0 or &gt;65535) will throw an error.
- Redis connection errors are logged to the console.
- Invalid CLI options result in an error message and exit code 1.

## Notes

- Ensure Redis is running and accessible at the specified `CACHE_URL`.
- The server only handles GET requests and follows redirects.
- Compression headers (`transfer-encoding`, `content-length`, `content-encoding`) are removed to prevent issues with proxied responses.
