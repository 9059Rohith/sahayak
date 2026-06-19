/**
 * Input validation & sanitization for the triage endpoint.
 *
 * Threats handled here:
 * - Oversized payloads / abuse  -> length caps on every field.
 * - XSS via reflected text       -> strip angle brackets / control chars.
 * - Prompt injection             -> we don't try to "clean" intent (that's the
 *   LLM prompt's job); we just normalise whitespace and cap length so a wall of
 *   injected text can't blow the context window.
 */

const LIMITS = Object.freeze({
  symptoms: 1000,
  perItem: 80,
  listLength: 15,
  age: 120,
});

// ASCII control characters (0x00-0x1F and 0x7F). Constructed from a string of
// hex escapes so this source file contains only printable characters.
const CONTROL_CHARS = new RegExp("[\\x00-\\x1F\\x7F]", "g");
const HTML_SIGNIFICANT = /[<>]/g;
const COLLAPSE_WS = /\s+/g;

/** Remove control chars and HTML-significant characters; collapse whitespace. */
export function sanitizeText(input, maxLen) {
  if (typeof input !== "string") return "";
  return input
    .replace(CONTROL_CHARS, " ")
    .replace(HTML_SIGNIFICANT, " ") // defang HTML so reflected output can't inject markup
    .replace(COLLAPSE_WS, " ")
    .trim()
    .slice(0, maxLen);
}

function sanitizeList(value, perItem, maxItems) {
  if (!Array.isArray(value)) return [];
  return value
    .slice(0, maxItems)
    .map((v) => sanitizeText(v, perItem))
    .filter(Boolean);
}

function sanitizeAge(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > LIMITS.age) return null;
  return Math.floor(n);
}

/**
 * Express middleware: validates and replaces req.body with a clean, typed object.
 * Rejects empty symptom text with 400.
 */
export function validateTriageInput(req, res, next) {
  const body = req.body || {};

  const symptoms = sanitizeText(body.symptoms, LIMITS.symptoms);
  if (!symptoms) {
    return res.status(400).json({
      error: "EMPTY_INPUT",
      message: "Please describe the symptoms (text was empty after validation).",
    });
  }

  const language = body.language === "hi" ? "hi" : "en";

  req.clean = {
    symptoms,
    language,
    age: sanitizeAge(body.age),
    currentMeds: sanitizeList(body.currentMeds, LIMITS.perItem, LIMITS.listLength),
    allergies: sanitizeList(body.allergies, LIMITS.perItem, LIMITS.listLength),
    consent: body.consent === true, // explicit consent flag for any persistence
  };

  return next();
}

export const INPUT_LIMITS = LIMITS;
