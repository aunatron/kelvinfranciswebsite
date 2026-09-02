/**
 * Minimal static server for out/ — used by the quality audits so they never
 * depend on a background process or an extra package. Node core only.
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".avif": "image/avif",
};

export function serveOut(root = "out", port = 0) {
  const server = createServer((req, res) => {
    const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
    let file = join(root, url);
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
    if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;
    if (!existsSync(file) || statSync(file).isDirectory()) {
      const notFound = join(root, "404.html");
      res.writeHead(404, { "content-type": TYPES[".html"] });
      res.end(existsSync(notFound) ? readFileSync(notFound) : "404");
      return;
    }
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(readFileSync(file));
  });
  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", () => {
      const address = server.address();
      const actualPort = typeof address === "object" && address ? address.port : port;
      resolve({ server, origin: `http://127.0.0.1:${actualPort}` });
    });
  });
}

/** Every route the audits should cover. */
export const ROUTES = [
  "/",
  "/record/",
  "/doctrine/",
  "/doctrine/doctrine-001/",
  "/doctrine/hunt-001/",
  "/doctrine/teach-001/",
  "/now/",
  "/credentials/",
  "/signal/",
  "/system/",
  "/archive/",
  "/track-record/",
];
