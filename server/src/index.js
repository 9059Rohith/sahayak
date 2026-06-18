import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

// Load env from both the project root and server/ so it works regardless of the
// directory the process is launched from. Existing process.env always wins.
const here = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(here, "../../.env") });
dotenv.config({ path: resolve(here, "../.env") });
dotenv.config();

import { createApp } from "./app.js";
import { isLlmConfigured, getModelName } from "./llm/llmClient.js";

const PORT = process.env.PORT || 8787;
const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`\nSahayak server listening on http://localhost:${PORT}`);
  console.log(`  Model:        ${getModelName()}`);
  console.log(
    `  LLM key:      ${isLlmConfigured() ? "configured" : "MISSING (rules-only fallback mode)"}`,
  );
  console.log(`  Health:       http://localhost:${PORT}/api/health\n`);
});

// Graceful shutdown so containers/orchestrators can stop us cleanly.
function shutdown(signal) {
  console.log(`\n${signal} received — shutting down gracefully…`);
  server.close(() => process.exit(0));
  // Force-exit if connections linger past 10s.
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
