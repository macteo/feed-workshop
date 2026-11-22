// Server statico minimo per la cartella web/ (porta 5173). Nessuna dipendenza.
import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../web");
const PORT = Number(process.env.WEB_PORT ?? 5173);
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp" };

http.createServer(async (req, res) => {
  let p;
  try { p = decodeURIComponent(new URL(req.url, "http://x").pathname); }
  catch { res.writeHead(400); return res.end(); }
  const file = path.resolve(root, "." + (p.endsWith("/") ? p + "index.html" : p));
  const rel = path.relative(root, file);
  if (rel.startsWith("..") || path.isAbsolute(rel)) { res.writeHead(403); return res.end(); }
  try {
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": (TYPES[path.extname(file)] ?? "application/octet-stream") + "; charset=utf-8", "Cache-Control": "no-store" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("non trovato");
  }
}).listen(PORT, "127.0.0.1", () => console.log(`Sito su http://localhost:${PORT}`));
