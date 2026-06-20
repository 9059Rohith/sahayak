import { checkRedFlags } from "../rules/redFlagRules.js";
import { checkInteractions } from "../rules/drugInteractions.js";
import { SIGNAL, escalate, normalizeSignal } from "../rules/signals.js";
import { buildSystemPrompt } from "../llm/systemPrompt.js";
import { requestTriage, isLlmConfigured, getModelName } from "../llm/llmClient.js";

/**
 * The orchestration core.
 *
 * Pipeline (order matters):
 *   1. Deterministic red-flag scan   (can force SEE_A_DOCTOR)
 *   2. Deterministic drug/allergy scan (can force CAUTION / SEE_A_DOCTOR)
 *   3. LLM triage opinion             (advisory)
 *   4. Merge: the FINAL signal is the most severe of all sources.
 *      Code rails can only ESCALATE the LLM, never soften it.
 *
 * This guarantees the "rules override the LLM" property even with an open model.
 */
export async function runTriage(clean, { signal: abortSignal } = {}) {
  const { symptoms, language, age, currentMeds, allergies } = clean;

  // ── 1. Deterministic safety rails (always run, never skipped) ──────────────
  const redFlags = checkRedFlags(symptoms);
  const drugCheck = checkInteractions(currentMeds, allergies);

  let finalSignal = SIGNAL.SAFE;
  finalSignal = escalate(finalSignal, redFlags.signal);
  finalSignal = escalate(finalSignal, drugCheck.signal);

  // ── 2. LLM advisory opinion (best-effort, degrades gracefully) ─────────────
  let llm = null;
  let llmError = null;

  if (isLlmConfigured()) {
    try {
      const parsed = await requestTriage({
        systemPrompt: buildSystemPrompt({ language }),
        userPayload: { symptoms, age, currentMeds, allergies },
        signal: abortSignal,
      });
      llm = shapeLlmResult(parsed);
      finalSignal = escalate(finalSignal, llm.signal);
    } catch (err) {
      llmError = err.code || "LLM_UNAVAILABLE";
    }
  } else {
    llmError = "LLM_NOT_CONFIGURED";
  }

  // ── 3. Strip any prescription/dosage leakage the model may have produced ───
  if (llm) llm = scrubProhibitedContent(llm);

  // ── 4. Compose the patient-facing result ───────────────────────────────────
  return composeResult({ finalSignal, redFlags, drugCheck, llm, llmError, language });
}

/** Coerce arbitrary LLM JSON into our known shape with safe defaults. */
function shapeLlmResult(parsed) {
  const arr = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === "string") : []);
  return {
    signal: normalizeSignal(parsed?.signal),
    summary: typeof parsed?.summary === "string" ? parsed.summary : "",
    followUpQuestions: arr(parsed?.followUpQuestions).slice(0, 3),
    otcGuidance: arr(parsed?.otcGuidance).slice(0, 6),
    redFlagsNoted: arr(parsed?.redFlagsNoted).slice(0, 6),
    rationale: typeof parsed?.rationale === "string" ? parsed.rationale : "",
  };
}

/**
 * Defence-in-depth: even though the prompt forbids it, an open model could name
 * a prescription drug or a dose. We redact obvious dosage patterns and known
 * Rx-only drug names from the patient-facing text as a last resort.
 */
const DOSE_PATTERN = /\b\d+(\.\d+)?\s?(mg|ml|mcg|g|tablet|tablets|tab|tabs|capsule|capsules|times a day|x daily|bd|tds|od)\b/gi;
const RX_WORDS = /\b(azithromycin|amoxicillin|amoxyclav|augmentin|ciprofloxacin|ciplox|metronidazole|flagyl|metrogyl|cifran|salbutamol|asthalin|azithral|prednisolone|dexamethasone)\b/gi;

function scrubLine(text) {
  if (typeof text !== "string") return "";
  return text.replace(DOSE_PATTERN, "[removed]").replace(RX_WORDS, "a prescription medicine");
}

function scrubProhibitedContent(llm) {
  return {
    ...llm,
    summary: scrubLine(llm.summary),
    rationale: scrubLine(llm.rationale),
    otcGuidance: llm.otcGuidance.map(scrubLine),
    followUpQuestions: llm.followUpQuestions.map(scrubLine),
  };
}

/** Build the final response object the route returns. */
function composeResult({ finalSignal, redFlags, drugCheck, llm, llmError, language }) {
  // Collect human-readable safety reasons from the deterministic engines.
  const safetyReasons = [];
  for (const m of redFlags.matches) safetyReasons.push({ source: "red-flag", ...m });
  for (const i of drugCheck.interactions)
    safetyReasons.push({ source: "interaction", label: i.message, severity: i.severity });
  for (const a of drugCheck.allergyConflicts)
    safetyReasons.push({ source: "allergy", label: a.message });
  for (const r of drugCheck.rxFlags) safetyReasons.push({ source: "rx-only", label: r.message });

  // Patient-facing summary: prefer the LLM's wording, fall back to a safe
  // deterministic message so the app always works even with no/failed LLM.
  const summary = llm?.summary || fallbackSummary(finalSignal, redFlags, language);

  return {
    signal: finalSignal,
    summary,
    followUpQuestions: llm?.followUpQuestions ?? [],
    otcGuidance: finalSignal === SIGNAL.SEE_A_DOCTOR ? [] : llm?.otcGuidance ?? [],
    safetyReasons,
    emergencyAdvice: redFlags.matches.map((m) => m.advice),
    meta: {
      model: getModelName(),
      llmUsed: Boolean(llm),
      llmError, // null when the model answered
      redFlagTriggered: redFlags.triggered,
      drugConflictTriggered:
        drugCheck.interactions.length > 0 ||
        drugCheck.allergyConflicts.length > 0 ||
        drugCheck.rxFlags.length > 0,
      disclaimer:
        "Sahayak is a triage aid, not a doctor. It never prescribes. Always confirm with a qualified pharmacist or physician.",
    },
  };
}

/** Deterministic patient message used when the LLM is unavailable. */
function fallbackSummary(signal, redFlags, language) {
  const hi = language === "hi";
  if (signal === SIGNAL.SEE_A_DOCTOR) {
    return hi
      ? "यह गंभीर हो सकता है। कृपया तुरंत डॉक्टर से मिलें या आपातकालीन सेवा (112 / 108) पर कॉल करें।"
      : "This may be serious. Please see a doctor right away or call emergency services (112 / 108).";
  }
  if (signal === SIGNAL.CAUTION) {
    return hi
      ? "सावधानी बरतें। आराम और तरल पदार्थ लें; लक्षण बढ़ने या बने रहने पर डॉक्टर से मिलें।"
      : "Use caution. Rest and take fluids; see a doctor if symptoms worsen or persist.";
  }
  return hi
    ? "सामान्यतः सुरक्षित लगता है। आराम करें, तरल पदार्थ लें, और ज़रूरत होने पर फार्मासिस्ट से सलाह लें।"
    : "This generally looks safe. Rest, stay hydrated, and ask your pharmacist if you need OTC support.";
}
