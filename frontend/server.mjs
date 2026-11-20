import { readFile, realpath, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, isAbsolute, relative, resolve, sep } from "node:path";

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https://data.norges-bank.no; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
};

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

async function readAsset(root, pathname) {
  if (
    typeof pathname !== "string" ||
    !pathname.startsWith("/") ||
    /[\\\0]/.test(pathname) ||
    pathname.split("/").some((part) => part === "." || part === "..")
  ) {
    throw Object.assign(new Error("Invalid asset path"), {
      code: "ERR_OUTSIDE_STATIC_ROOT",
    });
  }

  const filename = await realpath(resolve(root, `.${pathname}`));
  const location = relative(root, filename);
  if (location === ".." || location.startsWith(`..${sep}`) || isAbsolute(location)) {
    throw Object.assign(new Error("File outside static root"), {
      code: "ERR_OUTSIDE_STATIC_ROOT",
    });
  }
  return { filename, body: await readFile(filename) };
}

export async function createStaticServer(directory = new URL("./dist/", import.meta.url)) {
  const root = await realpath(directory);
  if (!(await stat(root)).isDirectory()) {
    throw new Error("Static root must be a directory");
  }

  return createServer(async (request, response) => {
    const send = (status, body, headers = {}) => {
      response.writeHead(status, {
        ...securityHeaders,
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Length": Buffer.byteLength(body),
        "Cache-Control": "no-store",
        ...headers,
      });
      response.end(request.method === "HEAD" ? undefined : body);
    };

    try {
      if (request.method !== "GET" && request.method !== "HEAD") {
        send(405, "Method Not Allowed", { Allow: "GET, HEAD" });
        return;
      }

      let pathname;
      try {
        pathname = decodeURIComponent(request.url.split("?")[0]);
      } catch (error) {
        if (!(error instanceof URIError)) throw error;
        send(400, "Bad Request");
        return;
      }
      if (!pathname.startsWith("/") || /[\\\0]/.test(pathname)) {
        send(400, "Bad Request");
        return;
      }
      if (pathname.split("/").some((part) => part.startsWith("."))) {
        send(403, "Forbidden");
        return;
      }
      if (pathname === "/internal/isAlive" || pathname === "/internal/isReady") {
        send(200, "OK");
        return;
      }

      const assetRequest = pathname === "/assets" || pathname.startsWith("/assets/");
      let asset;
      try {
        asset = await readAsset(
          root,
          pathname.endsWith("/") ? `${pathname}index.html` : pathname
        );
      } catch (error) {
        if (!["ENOENT", "ENOTDIR", "EISDIR"].includes(error.code)) throw error;
        if (assetRequest) {
          send(404, "Not Found");
          return;
        }
        asset = await readAsset(root, "/index.html");
      }

      send(200, asset.body, {
        "Content-Type":
          contentTypes[extname(asset.filename).toLowerCase()] ?? "application/octet-stream",
        "Cache-Control": assetRequest
          ? "public, max-age=31536000, immutable"
          : "no-cache, no-store, must-revalidate",
      });
    } catch (error) {
      if (error.code === "ERR_OUTSIDE_STATIC_ROOT") {
        send(403, "Forbidden");
        return;
      }
      console.error("Static file request failed:", error);
      send(500, "Internal Server Error");
    }
  });
}

if (import.meta.main) {
  const server = await createStaticServer();
  server.on("error", (error) => {
    console.error("HTTP server failed:", error);
    process.exitCode = 1;
  });
  server.listen(8080, "0.0.0.0");
  process.once("SIGTERM", () => server.close());
  process.once("SIGINT", () => server.close());
}
