import { describe, it, expect } from "vitest";
import { checkRedFlags } from "../src/rules/redFlagRules.js";
import { SIGNAL } from "../src/rules/signals.js";

describe("red-flag rules engine", () => {
  it("forces SEE_A_DOCTOR on chest pain (the headline safety case)", () => {
    const r = checkRedFlags("I have severe chest pain radiating to my left arm");
    expect(r.triggered).toBe(true);
    expect(r.signal).toBe(SIGNAL.SEE_A_DOCTOR);
    expect(r.matches[0].id).toBe("cardiac_chest_pain");
  });

  it("detects breathing difficulty", () => {
    expect(checkRedFlags("I cannot breathe properly").triggered).toBe(true);
  });

  it("detects Hindi / Romanised red flags (seene me dard)", () => {
    const r = checkRedFlags("mujhe seene me dard ho raha hai");
    expect(r.signal).toBe(SIGNAL.SEE_A_DOCTOR);
  });

  it("detects Devanagari red flags (सीने में दर्द)", () => {
    expect(checkRedFlags("मुझे सीने में दर्द है").triggered).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(checkRedFlags("CHEST PAIN since morning").triggered).toBe(true);
  });

  it("does NOT trigger on benign symptoms", () => {
    const r = checkRedFlags("mild fever and slight body ache since yesterday");
    expect(r.triggered).toBe(false);
    expect(r.signal).toBe(SIGNAL.SAFE);
  });

  it("handles empty / non-string input safely", () => {
    expect(checkRedFlags("").triggered).toBe(false);
    expect(checkRedFlags(undefined).triggered).toBe(false);
    expect(checkRedFlags(null).triggered).toBe(false);
  });

  it("catches suicidal ideation and routes to help", () => {
    const r = checkRedFlags("I want to end my life");
    expect(r.signal).toBe(SIGNAL.SEE_A_DOCTOR);
    expect(r.matches[0].advice).toMatch(/14416|1800/);
  });

  it("can report multiple simultaneous red flags", () => {
    const r = checkRedFlags("chest pain and I cannot breathe");
    expect(r.matches.length).toBeGreaterThanOrEqual(2);
  });
});
