# Sahayak — सहायक

> **Making India's 1.2M pharmacy counters safer.**
> A voice-first AI health-**triage** assistant for pharmacy counters. It listens to symptoms in the patient's own language, asks structured follow-ups, runs **code-enforced safety rails**, and outputs a clear **SAFE / CAUTION / SEE-A-DOCTOR** signal with a printable summary.
>
> **Sahayak triages and routes. It never prescribes.**

### 🔗 Live demo: **https://sahayak-hj7q.onrender.com**

> Try it: open the link, tap a demo scenario (or 🎙 speak in Chrome), and watch the colour-coded signal.
> Tap **Chest pain** to see the safety system force a red **SEE-A-DOCTOR** instantly.
> _Note: the free host may sleep after idle — the first request can take ~30s to wake._

---

## The problem

In India, the neighbourhood chemist is the *de facto* first doctor for hundreds of millions of people — especially in rural and small towns where doctors are scarce. The result is rampant self-medication, missed red-flag symptoms (a heart attack mistaken for "gas"), and antibiotic misuse that fuels a national antimicrobial-resistance crisis. Pharmacists are skilled but overloaded, and they have no safety net at the counter.

**Sahayak is that safety net** — a triage co-pilot that catches emergencies, flags dangerous drug combinations, and tells the patient plainly when an OTC remedy is reasonable versus when they must see a doctor.

---

## What it does

- 🎙️ **Voice-first, vernacular** — speak symptoms in **12 fully-localised Indian languages** (English, हिन्दी, বাংলা, தமிழ், తెలుగు, मराठी, ગુજરાતી, ಕನ್ನಡ, മലയാളം, ਪੰਜਾਬੀ, ଓଡ଼ିଆ, اردو — incl. RTL) via the Web Speech API, with a typed fallback. Both the UI and the triage advice appear in the chosen language.
- 🚦 **One clear signal** — SAFE / CAUTION / SEE-A-DOCTOR, colour-coded and read aloud.
- 🛑 **Deterministic red-flag engine** — chest pain, breathing difficulty, stroke signs, severe bleeding, infant fever, etc. force *SEE-A-DOCTOR* **in code**, so the LLM can never miss or be tricked past an emergency.
- 💊 **Drug-interaction + allergy checker** — runs in code against a 50-drug Indian OTC dataset; conflicts force CAUTION/escalate.
- 🤖 **LLM triage** — Groq-hosted Llama provides warm, structured follow-up questions and OTC self-care guidance — but **the rules always override the model**.
- 🖨️ **Printable summary** — hand the patient a clear record at the counter.
- 🔒 **Never prescribes** — no drug names, no doses; enforced in the prompt *and* re-scrubbed in code.

---

## Architecture at a glance

```
Browser (React/Vite/Tailwind, Web Speech)
        │  POST /api/triage  (sanitised JSON)
        ▼
Express API  ──►  validate + rate-limit
        │
        ├─► Red-flag rules engine      (deterministic, can force SEE-A-DOCTOR)
        ├─► Drug-interaction engine    (deterministic, can force CAUTION)
        └─► Groq LLM (advisory)        (OpenAI-compatible client)
                    │
                    ▼
        Merge: FINAL = most-severe(rails, LLM)   ← rules override the LLM
```

Full detail in **[ARCHITECTURE.md](./ARCHITECTURE.md)**. Security model in **[SECURITY.md](./SECURITY.md)**. Pitch in **[PITCH_DECK.md](./PITCH_DECK.md)**.

---

## Tech stack

| Layer       | Choice                                                             |
| ----------- | ----------------------------------------------------------------- |
| Frontend    | React + Vite + Tailwind CSS                                       |
| Voice       | Web Speech API (STT + TTS), typed fallback                        |
| Languages   | 12 Indian languages (6 fully localised UI; native triage in all) |
| Backend     | Node + Express (ES modules)                                       |
| LLM         | Groq API (OpenAI-compatible), `llama-3.3-70b-versatile`           |
| Safety data | Local JSON: 50-drug interaction DB + red-flag rules table         |
| Tests       | Vitest (safety-critical rules engine + drug checker)             |

---

## Setup & run

### Prerequisites
- Node.js 18+ (uses native `fetch`/`AbortController` and `node --watch`).
- A free Groq API key from <https://console.groq.com/keys> (optional — see *rules-only mode* below).

### 1. Configure environment
```bash
cp .env.example .env        # then edit .env and paste your GROQ_API_KEY
```
The server reads `.env` from the project root *and* `server/.env`.

| Variable        | Default                       | Notes                                          |
| --------------- | ----------------------------- | ---------------------------------------------- |
| `GROQ_API_KEY`  | *(none)*                      | Required for LLM features. Never commit it.    |
| `GROQ_MODEL`    | `llama-3.3-70b-versatile`     | Faster fallback: `llama-3.1-8b-instant`        |
| `PORT`          | `8787`                        | Backend port.                                  |
| `CORS_ORIGIN`   | `http://localhost:5173`       | Allowed frontend origin(s), comma-separated.   |

### 2. One command to run the whole demo
```bash
npm run demo
```
This installs all dependencies (root, server, client) and starts both the API and the Vite dev server concurrently. Then open **<http://localhost:5173>**.

Or run pieces individually:
```bash
npm run install:all   # install root + server + client deps
npm run dev           # run server + client together
npm test              # run the safety-engine unit tests
```

> **Rules-only mode:** if no `GROQ_API_KEY` is set, the app still runs. The deterministic red-flag and drug-interaction engines stay **fully active**, and the UI shows a banner. This guarantees the safety-critical demo (chest pain → SEE-A-DOCTOR) works even offline.

---

## Demo script — the 4 scenarios

Each is a one-tap button in the UI. Expected outputs:

| # | Scenario        | Input (spoken/typed)                                                        | Expected signal     | Why it matters                                                        |
| - | --------------- | -------------------------------------------------------------------------- | ------------------- | -------------------------------------------------------------------- |
| 1 | **Common fever** | "mild fever and body ache since yesterday"                                  | SAFE / CAUTION      | Sensible OTC self-care: rest, fluids, OTC fever reducer, review in 3 days. |
| 2 | **Child's cold** | "my 4 year old has a runny nose and mild cough"                             | CAUTION             | Age-aware: saline drops/fluids, avoid adult syrups, route if it persists. |
| 3 | **Stomach pain** | "stomach pain and gas since morning after eating out"                       | CAUTION             | Asks follow-ups (blood? fever? duration?) → conditional routing.     |
| 4 | **Chest pain**   | "severe chest pain radiating to my left arm, feeling sweaty"               | **SEE-A-DOCTOR**    | **Instant red-flag catch — proves the safety system.**              |

**Bonus to show judges:** add `Crocin` *and* `Dolo` to current medicines on any case → the drug engine flags a **paracetamol overdose risk** and escalates, with no LLM involved.

---

## Project structure

```
sahayak/
├── server/                 # Node + Express API
│   ├── src/
│   │   ├── index.js        # bootstrap
│   │   ├── app.js          # express app factory
│   │   ├── routes/         # /api endpoints
│   │   ├── services/       # triage orchestration
│   │   ├── rules/          # ★ deterministic safety engines
│   │   ├── llm/            # Groq client + system prompt
│   │   ├── middleware/     # validation, rate limiting
│   │   └── data/           # drugs.json, redFlags.json, scenarios.json
│   └── tests/              # vitest: rules engine + drug checker
├── client/                 # React + Vite + Tailwind UI
│   └── src/
│       ├── App.jsx
│       ├── components/     # SignalBadge, ResultCard, ChipInput
│       ├── hooks/          # useSpeech (Web Speech API)
│       └── lib/            # api client, i18n strings
├── README.md  ARCHITECTURE.md  SECURITY.md  PITCH_DECK.md
├── Dockerfile  .dockerignore
├── .env.example  .gitignore  package.json
```

---

## Production deployment

The frontend builds to static files that the Express server serves itself, so
the whole app deploys as **one unit** on a single port.

### Option A — Docker (recommended)
```bash
docker build -t sahayak .
docker run -p 8787:8787 -e GROQ_API_KEY=gsk_xxx sahayak
# open http://localhost:8787
```
The image is multi-stage (small Alpine runtime), runs as a **non-root** user,
and ships a container `HEALTHCHECK` against `/api/health`.

### Option B — Node host (Render / Railway / VPS)
```bash
npm run deploy:build     # install all deps + build the client bundle
npm start                # serves API + built SPA from server/ on $PORT
```

### Production environment variables

| Variable        | Set to                                  | Why |
| --------------- | --------------------------------------- | --- |
| `GROQ_API_KEY`  | your key (secret manager, not a file)   | LLM access |
| `GROQ_MODEL`    | `llama-3.3-70b-versatile` (or `…instant`)| quality vs latency |
| `PORT`          | platform-provided port                  | bind address |
| `SERVE_CLIENT`  | `true`                                  | serve the built SPA from Express |
| `TRUST_PROXY`   | `1` (behind one reverse proxy)          | correct client IP for rate limiting |
| `CORS_ORIGIN`   | your public origin (or omit if same-origin) | lock down cross-origin calls |
| `NODE_ENV`      | `production`                            | standard |

> **Security hardening already in place:** `helmet` security headers + strict
> Content-Security-Policy, per-IP rate limiting (proxy-aware), 16 kB body cap,
> input sanitisation + length caps, XSS-safe rendering, secrets only from env,
> no health-data persistence. See **[SECURITY.md](./SECURITY.md)**.

---

## Known limitations (honest scope)

- **Not a medical device.** Triage aid only; a human pharmacist stays in the loop.
- The 50-drug dataset is a curated **demo subset**, not an exhaustive pharmacopoeia. Production would integrate a maintained drug database (e.g. a national formulary API).
- Red-flag detection is **keyword-based** (transparent and auditable, but can miss unusual phrasing). Production would layer in an embedding/classifier check *in addition to* the keyword guardrail.
- Web Speech API quality and language coverage vary by browser (best in Chrome). Hindi STT accuracy depends on the device.
- No clinical validation or regulatory clearance — this is a hackathon prototype.

---

## License
MIT — see headers. For demonstration/educational use; not for clinical deployment as-is.
