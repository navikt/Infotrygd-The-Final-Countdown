import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import { request } from "node:http";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { createStaticServer } from "./server.mjs";

let directory;
let server;
let port;

before(async () => {
  directory = await mkdtemp(fileURLToPath(new URL("./.server-test-", import.meta.url)));
  const root = join(directory, "dist");
  await mkdir(join(root, "assets"), { recursive: true });
  await writeFile(join(root, "index.html"), "<!doctype html><h1>Countdown</h1>");
  await writeFile(join(root, "assets/app-abc123.js"), "console.log('countdown');");
  await writeFile(join(root, "assets/app-abc123.css"), "body { color: red; }");
  await writeFile(join(root, "assets/font.woff2"), Buffer.from([0, 1, 2, 255]));
  await writeFile(join(root, "manifest.json"), '{"name":"Countdown"}');
  await writeFile(join(directory, "outside.txt"), "not public");
  await symlink(join(directory, "outside.txt"), join(root, "assets/link.txt"));
  server = await createStaticServer(root);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  port = server.address().port;
});

after(async () => {
  if (server?.listening) await new Promise((resolve) => server.close(resolve));
  if (directory) await rm(directory, { recursive: true, force: true });
});

function get(path, method = "GET") {
  return new Promise((resolve, reject) => {
    const req = request({ host: "127.0.0.1", port, path, method }, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("error", reject);
      response.on("end", () =>
        resolve({
          status: response.statusCode,
          headers: response.headers,
          body: Buffer.concat(chunks).toString(),
        })
      );
    });
    req.on("error", reject);
    req.end();
  });
}

test("serves the entry page and SPA routes without caching HTML", async () => {
  for (const path of ["/", "/index.html", "/nested/route?query=value", "/nested/"]) {
    const response = await get(path);
    assert.equal(response.status, 200);
    assert.match(response.body, /Countdown/);
    assert.equal(response.headers["content-type"], "text/html; charset=utf-8");
    assert.equal(response.headers["cache-control"], "no-cache, no-store, must-revalidate");
    assert.equal(response.headers["x-content-type-options"], "nosniff");
    assert.equal(response.headers["x-frame-options"], "DENY");
    assert.equal(response.headers["referrer-policy"], "no-referrer");
    assert.equal(response.headers["permissions-policy"], "camera=(), microphone=(), geolocation=()");
    assert.match(
      response.headers["content-security-policy"],
      /connect-src 'self' https:\/\/data\.norges-bank\.no/
    );
    assert.match(response.headers["content-security-policy"], /frame-ancestors 'none'/);
  }
});

test("serves assets with MIME types, immutable caching and security headers", async () => {
  for (const [path, contentType] of [
    ["/assets/app-abc123.js?v=1", "text/javascript; charset=utf-8"],
    ["/assets/app-abc123.css", "text/css; charset=utf-8"],
    ["/assets/font.woff2", "font/woff2"],
  ]) {
    const response = await get(path);
    assert.equal(response.status, 200);
    assert.equal(response.headers["content-type"], contentType);
    assert.equal(response.headers["cache-control"], "public, max-age=31536000, immutable");
    assert.equal(response.headers["x-content-type-options"], "nosniff");
    assert.equal(response.headers["x-frame-options"], "DENY");
  }
  const manifest = await get("/manifest.json");
  assert.equal(manifest.headers["content-type"], "application/json");
  assert.equal(manifest.body, '{"name":"Countdown"}');
});

test("returns 404 rather than HTML for missing assets", async () => {
  const response = await get("/assets/missing.js");
  assert.equal(response.status, 404);
  assert.equal(response.body, "Not Found");
  assert.equal(response.headers["cache-control"], "no-store");
});

test("serves Nais health endpoints without caching", async () => {
  for (const path of ["/internal/isAlive", "/internal/isReady?probe=1"]) {
    const response = await get(path);
    assert.equal(response.status, 200);
    assert.equal(response.body, "OK");
    assert.equal(response.headers["cache-control"], "no-store");
  }
});

test("HEAD returns GET headers without a body", async () => {
  for (const path of ["/", "/assets/app-abc123.js", "/internal/isReady", "/assets/missing.js"]) {
    const getResponse = await get(path);
    const headResponse = await get(path, "HEAD");
    assert.equal(headResponse.status, getResponse.status);
    assert.equal(headResponse.body, "");
    for (const header of ["content-type", "content-length", "cache-control"]) {
      assert.equal(headResponse.headers[header], getResponse.headers[header]);
    }
  }
});

test("rejects unsupported HTTP methods", async () => {
  for (const method of ["POST", "PUT", "DELETE", "OPTIONS"]) {
    const response = await get("/", method);
    assert.equal(response.status, 405);
    assert.equal(response.headers.allow, "GET, HEAD");
  }
});

test("rejects malformed, traversal, hidden-file and escaping symlink paths", async () => {
  for (const [path, status] of [
    ["/%ZZ", 400],
    ["/%00", 400],
    ["/assets%5cfile", 400],
    ["/../outside.txt", 403],
    ["/%2e%2e/outside.txt", 403],
    ["/assets/%2e%2e/%2e%2e/outside.txt", 403],
    ["/.env", 403],
    ["/assets/link.txt", 403],
  ]) {
    const response = await get(path);
    assert.equal(response.status, status, path);
    assert.doesNotMatch(response.body, /not public/);
  }
});

test("fails startup when the build directory is missing or is a file", async () => {
  await assert.rejects(createStaticServer(join(directory, "missing")), { code: "ENOENT" });
  await assert.rejects(createStaticServer(join(directory, "outside.txt")), /must be a directory/);
});
