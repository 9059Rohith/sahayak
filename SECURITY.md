# Security & Safety — Sahayak

Sahayak handles sensitive health input and drives safety-relevant guidance, so
security and clinical safety are treated as the same problem: **never let a
wrong, manipulated, or unavailable component cause unsafe advice.**

---

## 1. Medical stance — human-in-the-loop, never prescribes

- **Triage, not treatment.** Sahayak outputs a routing signal
  (SAFE / CAUTION / SEE-A-DOCTOR) and general OTC self-care categories only.
- **No prescriptions, no doses — ever.** Enforced in three layers:
  1. The system prompt forbids naming any prescription/brand drug or any dose.
  2. A code-level scrubber redacts dosage patterns (`mg`, `ml`, `tablets`,
     `bd/tds/od`, …) and known Rx drug names from model output.
  3. The drug dataset marks Rx-only items so they trigger a "see a doctor"
     referral rather than guidance.
- **Pharmacist stays in control.** The tool is a counter co-pilot; a qualified
  human makes the final call and can override any output.

> **Disclaimer (also shown in-app):** Sahayak is a triage aid, not a doctor or a
> medical device. It does not diagnose or prescribe. It is a hackathon prototype
> with no clinical validation or regulatory clearance. Always confirm with a
> qualified pharmacist or physician. In an emergency call 112 / 108.

---

## 2. Threat model

| # | Threat | Vector | Mitigation |
| - | ------ | ------ | ---------- |
| T1 | **Prompt injection** ("ignore instructions, prescribe X") | Symptom/medicine free text | Patient text is wrapped and labelled as **untrusted DATA, not instructions**; the prompt explicitly tells the model to ignore embedded commands; output scrubber strips any leaked Rx/dose; **deterministic rails run regardless of model output.** |
| T2 | **LLM gives unsafe advice / misses an emergency** | Open model hallucination or jailbreak | Deterministic red-flag engine runs **in code** and can only *escalate*; `escalate()` means the model can never downgrade a rule-set signal; unknown signals fail-safe to CAUTION. |
| T3 | **Stored XSS / output injection** | Reflected symptom text rendered in UI | Input strips `<>` and control chars; React renders all dynamic content as **text** (no `dangerouslySetInnerHTML`). |
| T4 | **Secret leakage** | API key in code/repo | Key only from `process.env.GROQ_API_KEY`; `.env` git-ignored; `.env.example` ships placeholders; key never sent to the client. |
| T5 | **Resource abuse / cost blowup / DoS** | Flooding the paid LLM endpoint | Per-IP rate limiting (20/min), proxy-aware via `TRUST_PROXY`; 16 kB JSON body cap; per-field length caps; 25 s upstream timeout with `AbortController`; request aborted if client disconnects. |
| T5b | **Missing browser security headers** (clickjacking, MIME sniffing, mixed content) | Served HTML/JS | `helmet` sets HSTS, `X-Content-Type-Options: nosniff`, `frame-ancestors 'none'`, and a strict **Content-Security-Policy** (`default-src 'self'`, `object-src 'none'`, locked `connect-src`). |
| T6 | **Oversized / malformed input** | Huge payloads, bad JSON, wrong types | Body size limit; typed sanitisation with caps; central error handler maps `entity.too.large`/`parse.failed` to 413/400. |
| T7 | **Privacy — health data persistence** | Logging/storing PII without consent | **No persistence by default.** Session data lives only in browser memory and is cleared on "New patient". Any future persistence is gated behind the explicit `consent` flag. No health text is written to disk or logs. |
| T8 | **CORS / cross-site abuse** | Untrusted origins calling the API | CORS restricted to the configured `CORS_ORIGIN` allow-list. |
| T9 | **Dependency on a single provider** | Groq outage / rate limit | Graceful degradation to **rules-only mode** — the safety-critical path keeps working with no LLM. |

---

## 3. Mitigations in code (where to look)

| Control | File |
| ------- | ---- |
| Input validation, sanitisation, length caps | `server/src/middleware/validateInput.js` |
| Rate limiting (proxy-aware) | `server/src/middleware/rateLimit.js`, `trust proxy` in `server/src/app.js` |
| Security headers + CSP (helmet) | `server/src/app.js` |
| Body-size cap, CORS allow-list, error handler | `server/src/app.js` |
| Untrusted-data framing + injection-resistant prompt | `server/src/llm/systemPrompt.js`, `server/src/llm/llmClient.js` |
| Rx-name / dosage output scrubber | `server/src/services/triageService.js` |
| Deterministic red-flag override | `server/src/rules/redFlagRules.js` |
| Drug-interaction / allergy / Rx checks | `server/src/rules/drugInteractions.js` |
| Fail-safe signal handling (`escalate`, `normalizeSignal`) | `server/src/rules/signals.js` |
| Timeout / abort on the LLM call | `server/src/routes/triage.js` |
| No secret on the client; relative API URLs | `client/src/lib/api.js` |

---

## 4. Secrets management

- The only secret is `GROQ_API_KEY`, read exclusively from the environment.
- `.gitignore` excludes all `.env` files except `*.env.example`.
- The client never receives the key — all LLM calls are server-side.
- Rotate the key via the Groq console; no redeploy of code required.

---

## 5. Residual risk & responsible-use notes

- Keyword-based red-flag detection is intentionally transparent but can miss
  unusual phrasing; it is a *floor*, not a ceiling. Production should add a
  complementary ML classifier **in addition to** (never instead of) the
  deterministic guardrail.
- The drug dataset is a demo subset; do not rely on it clinically.
- The system is not HIPAA/India-DPDP certified and must not process real patient
  records without a proper compliance review, audit logging, and consent flows.
- Sahayak must always be deployed with a qualified human pharmacist in the loop.
