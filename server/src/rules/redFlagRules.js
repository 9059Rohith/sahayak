import { createRequire } from "node:module";
import { SIGNAL } from "./signals.js";

// JSON import that works the same on every Node version without import assertions.
const require = createRequire(import.meta.url);
const redFlagData = require("../data/redFlags.json");

/**
 * Deterministic red-flag detector.
 *
 * This is the single most important safety guardrail: because Sahayak uses an
 * open LLM that could be wrong or manipulated, we run a code-level keyword scan
 * for life-threatening presentations. ANY match forces SEE-A-DOCTOR and the
 * LLM's opinion can never override it.
 *
 * We deliberately keep this simple and explainable (substring keyword match)
 * rather than clever — a pharmacist and an auditor must both be able to read
 * exactly why a case was escalated.
 */

const RULES = redFlagData.rules;

/**
 * @param {string} symptomText untrusted patient/pharmacist input (already sanitized)
 * @returns {{ triggered: boolean, signal: string, matches: Array<{id,label,advice}> }}
 */
export function checkRedFlags(symptomText) {
  const haystack = String(symptomText || "").toLowerCase();
  const matches = [];

  for (const rule of RULES) {
    const hit = rule.keywords.find((kw) => haystack.includes(kw.toLowerCase()));
    if (hit) {
      matches.push({ id: rule.id, label: rule.label, advice: rule.advice, matchedOn: hit });
    }
  }

  return {
    triggered: matches.length > 0,
    signal: matches.length > 0 ? SIGNAL.SEE_A_DOCTOR : SIGNAL.SAFE,
    matches,
  };
}

/** Exposed for tests / documentation. */
export function listRedFlagRules() {
  return RULES.map(({ id, label }) => ({ id, label }));
}
