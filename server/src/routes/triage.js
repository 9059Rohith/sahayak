import { Router } from "express";
import { createRequire } from "node:module";
import { validateTriageInput } from "../middleware/validateInput.js";
import { triageRateLimiter } from "../middleware/rateLimit.js";
import { runTriage } from "../services/triageService.js";
import { isLlmConfigured, getModelName } from "../llm/llmClient.js";
import { listKnownDrugCount } from "../rules/drugInteractions.js";
import { listRedFlagRules } from "../rules/redFlagRules.js";

const require = createRequire(import.meta.url);
const scenarios = require("../data/scenarios.json").scenarios;

const router = Router();

/** Health & capability probe — also used by the frontend to show LLM status. */
router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    llmConfigured: isLlmConfigured(),
    model: getModelName(),
    knownDrugs: listKnownDrugCount(),
    redFlagRules: listRedFlagRules().length,
  });
});

/** Seed demo scenarios for the one-tap demo buttons. */
router.get("/scenarios", (_req, res) => {
  res.json({ scenarios });
});

/**
 * Main triage endpoint.
 * Flow: rate-limit -> validate/sanitize -> orchestrate (rules + LLM) -> respond.
 */
router.post("/triage", triageRateLimiter, validateTriageInput, async (req, res) => {
  // Abort the upstream LLM call if the client disconnects or we hit a timeout.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);
  req.on("close", () => controller.abort());

  try {
    const result = await runTriage(req.clean, { signal: controller.signal });
    res.json(result);
  } catch (err) {
    // The service already degrades gracefully; this catches truly unexpected errors.
    console.error("[triage] unexpected error:", err);
    res.status(500).json({
      error: "TRIAGE_FAILED",
      message: "Something went wrong while processing the triage. Please try again.",
    });
  } finally {
    clearTimeout(timeout);
  }
});

export default router;
