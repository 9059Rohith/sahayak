import { createRequire } from "node:module";
import { SIGNAL } from "./signals.js";

const require = createRequire(import.meta.url);
const drugData = require("../data/drugs.json");

/**
 * Code-level drug-interaction & allergy checker.
 *
 * Runs alongside the LLM against the local JSON knowledge base. Any conflict it
 * finds forces at least CAUTION (high-severity interactions and allergy
 * contraindications escalate harder). Like the red-flag engine, this is
 * intentionally deterministic and explainable.
 */

const DRUGS = drugData.drugs;
const INTERACTIONS = drugData.interactions;
const CROSS_ALLERGY = drugData.crossAllergy || {};

/** Escape a string for safe use inside a RegExp. */
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** True if `alias` appears as a whole word/phrase inside the query. */
function containsWholeWord(query, alias) {
  return new RegExp(`(?:^|\\W)${escapeRegExp(alias)}(?:$|\\W)`).test(query);
}

/**
 * Resolve a free-text drug name/brand to a known drug record, or null.
 * We match exact aliases first, then whole-word aliases inside a phrase
 * (e.g. "dolo 650" -> paracetamol). Whole-word matching is important so that
 * "levocetirizine" does NOT collapse into "cetirizine".
 */
export function resolveDrug(text) {
  const q = String(text || "").trim().toLowerCase();
  if (!q) return null;

  // 1) Exact alias match.
  const exact = DRUGS.find((d) => d.aliases.includes(q));
  if (exact) return exact;

  // 2) Whole-word alias appearing within the query string.
  return DRUGS.find((d) => d.aliases.some((a) => containsWholeWord(q, a))) || null;
}

/**
 * Resolve a list of free-text names. We KEEP duplicates (resolved to the same
 * drug) on purpose: two products of the same drug is exactly the
 * double-dosing / overdose case the interaction rules must catch.
 */
function resolveAll(names = []) {
  const resolved = [];
  for (const name of names) {
    const drug = resolveDrug(name);
    if (drug) resolved.push(drug);
  }
  return resolved;
}

function matchesPair(drugA, drugB, rule) {
  // Rule can match on classes or on allergy groups; order-independent.
  const pairValues = (a, b, keyList, accessor) => {
    const [x, y] = keyList;
    return (
      (accessor(a) === x && accessor(b) === y) || (accessor(a) === y && accessor(b) === x)
    );
  };
  if (rule.matchClasses) {
    return pairValues(drugA, drugB, rule.matchClasses, (d) => d.class);
  }
  if (rule.matchAllergyGroups) {
    return pairValues(drugA, drugB, rule.matchAllergyGroups, (d) => d.allergyGroup);
  }
  return false;
}

/**
 * Check a set of medicines (current meds + anything under consideration) for
 * interactions and Rx-only red flags.
 *
 * @param {string[]} medNames free-text medicine names
 * @param {string[]} allergyNames free-text reported allergies (e.g. "penicillin")
 * @returns {{ signal, interactions: [], allergyConflicts: [], rxFlags: [], unrecognized: [] }}
 */
export function checkInteractions(medNames = [], allergyNames = []) {
  const drugs = resolveAll(medNames); // keeps duplicates for the pairwise scan
  const uniqueDrugs = [...new Map(drugs.map((d) => [d.id, d])).values()];
  const unrecognized = medNames.filter((n) => !resolveDrug(n));

  const interactions = [];
  let signal = SIGNAL.SAFE;

  // 1) Pairwise interaction / duplication scan.
  for (let i = 0; i < drugs.length; i += 1) {
    for (let j = i + 1; j < drugs.length; j += 1) {
      for (const rule of INTERACTIONS) {
        if (matchesPair(drugs[i], drugs[j], rule)) {
          interactions.push({
            id: rule.id,
            severity: rule.severity,
            message: rule.message,
            between: [drugs[i].name, drugs[j].name],
          });
          signal = rule.severity === "high" ? SIGNAL.SEE_A_DOCTOR : SIGNAL.CAUTION;
        }
      }
    }
  }

  // 2) Allergy contraindication scan.
  const allergyConflicts = [];
  const reportedGroups = allergyNames
    .flatMap((a) => allergyGroupsForReport(a))
    .filter(Boolean);
  for (const drug of uniqueDrugs) {
    if (drug.allergyGroup && reportedGroups.includes(drug.allergyGroup)) {
      allergyConflicts.push({
        drug: drug.name,
        allergyGroup: drug.allergyGroup,
        message: `Patient reports a ${drug.allergyGroup} allergy — ${drug.name} is contraindicated.`,
      });
      signal = SIGNAL.SEE_A_DOCTOR;
    }
  }

  // 3) Prescription-only flag: presence of an Rx drug means this is not an OTC matter.
  const rxFlags = uniqueDrugs
    .filter((d) => d.rxOnly)
    .map((d) => ({ drug: d.name, message: `${d.name} is prescription-only — refer to a doctor.` }));
  if (rxFlags.length > 0) signal = SIGNAL.SEE_A_DOCTOR;

  return { signal, interactions, allergyConflicts, rxFlags, unrecognized };
}

/** Map a reported allergy term to the drug allergy groups it rules out. */
function allergyGroupsForReport(reportText) {
  const q = String(reportText || "").trim().toLowerCase();
  if (!q) return [];
  // Direct match against a known cross-allergy key (e.g. "penicillin", "nsaid").
  for (const [key, groups] of Object.entries(CROSS_ALLERGY)) {
    if (q.includes(key)) return groups;
  }
  // Also map a branded/active term to its group via the drug table.
  const drug = resolveDrug(q);
  return drug?.allergyGroup ? [drug.allergyGroup] : [];
}

export function listKnownDrugCount() {
  return DRUGS.length;
}
