/**
 * Canonical triage signals used across the whole app.
 * Ordered by severity so we can always escalate to the most serious one.
 */
export const SIGNAL = Object.freeze({
  SAFE: "SAFE",
  CAUTION: "CAUTION",
  SEE_A_DOCTOR: "SEE_A_DOCTOR",
});

// Higher number = more severe. Used to "never downgrade" a triage decision.
const SEVERITY_RANK = {
  [SIGNAL.SAFE]: 0,
  [SIGNAL.CAUTION]: 1,
  [SIGNAL.SEE_A_DOCTOR]: 2,
};

/** Return the more severe of two signals. Safety rails can only escalate. */
export function escalate(a, b) {
  const ra = SEVERITY_RANK[a] ?? 0;
  const rb = SEVERITY_RANK[b] ?? 0;
  return ra >= rb ? a : b;
}

/** Normalise any LLM-provided signal string to a known value (defaults to CAUTION). */
export function normalizeSignal(raw) {
  if (typeof raw !== "string") return SIGNAL.CAUTION;
  const v = raw.trim().toUpperCase().replace(/[\s-]+/g, "_");
  if (v === "SEE_A_DOCTOR" || v === "DOCTOR" || v === "SEEADOCTOR") return SIGNAL.SEE_A_DOCTOR;
  if (v === "CAUTION") return SIGNAL.CAUTION;
  if (v === "SAFE") return SIGNAL.SAFE;
  // Unknown / unexpected output → fail safe to CAUTION, never to SAFE.
  return SIGNAL.CAUTION;
}
