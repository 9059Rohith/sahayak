import { describe, it, expect } from "vitest";
import { checkInteractions, resolveDrug } from "../src/rules/drugInteractions.js";
import { SIGNAL } from "../src/rules/signals.js";

describe("drug resolver", () => {
  it("resolves Indian brand names to active drugs", () => {
    expect(resolveDrug("Crocin")?.id).toBe("paracetamol");
    expect(resolveDrug("dolo 650")?.id).toBe("paracetamol");
    expect(resolveDrug("Brufen")?.id).toBe("ibuprofen");
  });

  it("returns null for unknown medicines", () => {
    expect(resolveDrug("madeup-xyz")).toBeNull();
    expect(resolveDrug("")).toBeNull();
  });
});

describe("drug-interaction checker", () => {
  it("flags two NSAIDs together as a HIGH-severity escalation", () => {
    const r = checkInteractions(["ibuprofen", "naproxen"]);
    expect(r.interactions.length).toBeGreaterThan(0);
    expect(r.signal).toBe(SIGNAL.SEE_A_DOCTOR);
  });

  it("flags double paracetamol (overdose risk)", () => {
    const r = checkInteractions(["crocin", "dolo"]);
    expect(r.signal).toBe(SIGNAL.SEE_A_DOCTOR);
    expect(r.interactions.some((i) => i.id === "paracetamol_double")).toBe(true);
  });

  it("flags stacked antihistamines as moderate CAUTION", () => {
    const r = checkInteractions(["cetirizine", "levocetirizine"]);
    expect(r.signal).toBe(SIGNAL.CAUTION);
  });

  it("flags allergy contraindication (penicillin allergy + amoxicillin)", () => {
    const r = checkInteractions(["amoxicillin"], ["penicillin"]);
    expect(r.allergyConflicts.length).toBe(1);
    expect(r.signal).toBe(SIGNAL.SEE_A_DOCTOR);
  });

  it("maps NSAID allergy across to aspirin/salicylate", () => {
    const r = checkInteractions(["aspirin"], ["nsaid"]);
    expect(r.allergyConflicts.length).toBe(1);
  });

  it("flags prescription-only drugs and escalates", () => {
    const r = checkInteractions(["azithromycin"]);
    expect(r.rxFlags.length).toBe(1);
    expect(r.signal).toBe(SIGNAL.SEE_A_DOCTOR);
  });

  it("returns SAFE for a single harmless OTC drug", () => {
    const r = checkInteractions(["paracetamol"]);
    expect(r.signal).toBe(SIGNAL.SAFE);
    expect(r.interactions).toEqual([]);
  });

  it("reports unrecognized medicines without crashing", () => {
    const r = checkInteractions(["paracetamol", "totally-unknown-drug"]);
    expect(r.unrecognized).toContain("totally-unknown-drug");
  });

  it("handles empty input", () => {
    const r = checkInteractions([], []);
    expect(r.signal).toBe(SIGNAL.SAFE);
  });
});
