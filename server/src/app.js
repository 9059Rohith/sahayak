import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import triageRouter from "./routes/triage.js";

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Express app factory. Kept separate from the server bootstrap so tests can
 * import the app without binding a port.
 */
export function createApp() {
  const app = express();

  // Trust the reverse proxy (Render/Railway/Nginx) so express-rate-limit and
  // logging see the real client IP. Configurable to avoid IP-spoofing the
  // rate limiter when there is NO proxy in front (default: off).
  if (process.env.TRUST_PROXY) {
    const v = process.env.TRUST_PROXY;
    app.set("trust proxy", v === "true" ? 1 : Number.isNaN(Number(v)) ? v : Number(v));
  }

  // ── Security headers ───────────────────────────────────────────────────────
  // helmet sets sensible defaults (HSTS, no-sniff, frameguard, etc.). The CSP
  // is scoped to a same-origin SPA that only talks to its own /api.
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "default-src": ["'self'"],
          "script-src": ["'self'"],
          // React/Tailwind inject a few inline styles at runtime.
          "style-src": ["'self'", "'unsafe-inline'"],
          "img-src": ["'self'", "data:"],
          "connect-src": ["'self'"],
          "object-src": ["'none'"],
          "base-uri": ["'self'"],
          "frame-ancestors": ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false, // not needed; avoids breaking dev tooling
    }),
  );

  // Restrict CORS to the configured frontend origin(s). When the SPA is served
  // same-origin (production static serving), CORS is effectively a no-op.
  const origins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  app.use(cors({ origin: origins }));

  // Small body cap — triage payloads are tiny; this blocks oversized abuse early.
  app.use(express.json({ limit: "16kb" }));

  // ── API ────────────────────────────────────────────────────────────────────
  app.use("/api", triageRouter);
  app.use("/api", (_req, res) => res.status(404).json({ error: "NOT_FOUND" }));

  // ── Production: serve the built SPA as a single deployable unit ─────────────
  const clientDist = resolve(here, "../../client/dist");
  const serveClient = process.env.SERVE_CLIENT === "true" || existsSync(clientDist);
  if (serveClient && existsSync(clientDist)) {
    app.use(express.static(clientDist, { maxAge: "1h", index: false }));
    // SPA history fallback for any non-API route.
    app.get("*", (_req, res) => res.sendFile(resolve(clientDist, "index.html")));
  }

  // Centralised error handler (e.g. malformed JSON body).
  app.use((err, _req, res, _next) => {
    if (err?.type === "entity.too.large") {
      return res.status(413).json({ error: "PAYLOAD_TOO_LARGE" });
    }
    if (err?.type === "entity.parse.failed") {
      return res.status(400).json({ error: "BAD_JSON" });
    }
    console.error("[app] error:", err);
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  });

  return app;
}
