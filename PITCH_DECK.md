# Sahayak — Pitch Deck

> **Framing line (repeat 3×):** *"Making India's 1.2 million pharmacy counters safer."*
> **One-sentence pitch:** *Sahayak is a voice-first AI triage co-pilot for pharmacy counters that catches medical emergencies and dangerous drug combinations — it triages and routes, it never prescribes.*

This file is build-ready: each slide has a **headline**, **speaker bullets**,
**presenter notes**, and a **🎨 Gemini image prompt** you can paste directly into
Gemini / Imagen to generate the slide visual. A shared **Visual Style Guide**
(below) keeps every generated image consistent.

---

## 🎨 Visual Style Guide (paste this once into Gemini before generating images)

> **Brand & art direction for all slides:** Modern, clean, optimistic healthcare-tech aesthetic with an Indian context. **Primary palette:** deep teal `#0f766e`, with a clear triage signal system — green `#16a34a` (safe), amber `#d97706` (caution), red `#dc2626` (danger). Backgrounds: soft off-white `#f8fafc` or subtle teal gradients. **Typography overlays:** bold geometric sans-serif, generous whitespace. **Illustration style:** semi-flat vector with soft depth, warm and human, diverse Indian people (pharmacists, rural patients, families), authentic Indian pharmacy/chemist-shop settings (green cross sign, medicine shelves). Avoid clichés, avoid text-heavy images, avoid scary/graphic medical imagery. 16:9 aspect ratio. Leave clean negative space in the top third for a headline.

---

## Slide 1 — Title

### Sahayak — Making India's 1.2 million pharmacy counters safer
**सहायक · "the helper"**

- **Tagline:** *Voice-first AI triage at the counter — it triages, it never prescribes.*
- **Team:** [Your team name] · [Hackathon name] 2026
- **The 10-second version:** Speak your symptoms in your own language → get a clear **SAFE / CAUTION / SEE-A-DOCTOR** answer, backed by safety rules that an AI can never override.

> **Presenter note:** Open with energy. "Raise your hand if your family's first stop for a cough or fever is the local chemist, not a doctor." Most hands go up. "That's 900 million people. Today we make that moment safer."

🎨 **Gemini prompt:** *A warm, modern hero illustration of a friendly Indian pharmacist at a neighbourhood chemist counter, smiling while a tablet/phone on the counter shows a glowing green-amber-red triage signal. Deep teal brand color, soft off-white background, semi-flat vector style with soft depth. A subtle green pharmacy cross in the background. Optimistic, trustworthy, human. Clean negative space in the top third for the title "Sahayak". 16:9.*

---

## Slide 2 — The Problem

### The chemist is India's first doctor — with no safety net
- In India, the neighbourhood **pharmacist is the de facto first point of care** for hundreds of millions, especially where doctors are scarce.
- This drives three compounding harms:
  - **Unsafe self-medication** — wrong OTC choices, risky drug combinations.
  - **Missed red flags** — a heart attack dismissed as "gas," an infant's fever sent home.
  - **Antibiotic misuse** — fueling India's antimicrobial-resistance crisis, a global threat.
- **The hard stat:** India has roughly **1 government doctor per ~1,500+ people** — well below the WHO 1:1,000 norm — and the gap is silently absorbed at the pharmacy counter.

> **Presenter note:** Land the emotion on "missed red flags." Pause after the heart-attack line. This is the wedge for our whole solution.

🎨 **Gemini prompt:** *An editorial split-scene illustration showing the strain on India's first-line healthcare: on one side a long queue of diverse rural patients outside a small clinic, on the other a single overwhelmed pharmacist behind a busy counter. Muted tones with one red warning accent to suggest missed danger. Semi-flat vector, empathetic not bleak, deep teal and amber palette. Space at top for headline. 16:9.*

---

## Slide 3 — Who Feels It Most

### The people most at risk are the least served
- **Rural & small-town patients** — a real doctor can be hours and a day's wage away; the chemist is right there.
- **Low-literacy users** — can't read English drug leaflets or navigate health apps; **voice is their only natural interface**.
- **Vulnerable groups** — children, the elderly, and pregnant women, where a wrong call is most dangerous.
- **Overloaded pharmacists** — skilled but unsupported, carrying real liability with no decision aid.
- **Net effect:** preventable harm lands hardest exactly where the health system is thinnest.

> **Presenter note:** Make it concrete — name a persona: "Meet Sunita, 52, in a village in UP. Her nearest doctor is 40 km away. Her chemist is 40 metres away."

🎨 **Gemini prompt:** *A warm portrait-style illustration of a middle-aged rural Indian woman ("Sunita") speaking to a kind pharmacist, with a soft speech-bubble showing a microphone/voice waveform icon to emphasise voice-first access. Authentic small-town India, saree, modest chemist shop. Deep teal accents, hopeful lighting, semi-flat vector. Headline space at top. 16:9.*

---

## Slide 4 — The Solution

### Sahayak: speak your symptoms, get a safe signal
- **Voice-first & vernacular** — speak in **12 Indian languages** (Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Urdu + English). Typed fallback for any device.
- **Structured triage** — asks the right follow-up questions, then returns **one unambiguous signal: SAFE · CAUTION · SEE-A-DOCTOR**, read aloud and colour-coded.
- **Triages, never prescribes** — gives general OTC self-care categories or a doctor referral; **no drug names, no doses, ever**.
- **Acts as a real co-pilot** — checks drug interactions & allergies live, and prints a clear summary the patient can carry.

> **Presenter note:** This is the "what it is" slide. Keep it crisp — the demo on the next slide does the convincing.

🎨 **Gemini prompt:** *A clean product-hero shot of the Sahayak app UI on a tablet at a pharmacy counter: a large microphone button, and a bold result card showing a green "SAFE" / amber "CAUTION" / red "SEE A DOCTOR" signal with a printable summary beside it. Modern flat UI, deep teal brand, green-amber-red signal chips, crisp and trustworthy. Top headline space. 16:9.*

---

## Slide 5 — Live Demo

### Four taps, four real outcomes — watch the safety system prove itself
| Scenario | Spoken input | Result |
| --- | --- | --- |
| 🤒 **Common fever** | "mild fever and body ache since yesterday" | **SAFE/CAUTION** → rest, fluids, OTC fever reducer, review in 3 days |
| 👶 **Child's cold** | "my 4-year-old has a runny nose and cough" | **CAUTION**, age-aware → saline + fluids, route if it persists |
| 🤰 **Stomach pain** | "stomach pain and gas since morning" | **CAUTION** → asks follow-ups, conditional routing |
| ❤️ **Chest pain** | "severe chest pain spreading to my left arm" | **🚨 SEE-A-DOCTOR — instantly** |

- **The money moment:** the chest-pain case is escalated by a **deterministic rule in code** — even if the AI is wrong, offline, or jailbroken, it *cannot* miss it.
- **Bonus flex:** add `Crocin` **+** `Dolo` to current meds → Sahayak flags a **paracetamol overdose risk** with no AI involved at all.

> **Presenter note:** DO the live demo here. Tap chest pain last. Let the red screen and the spoken "See a doctor" land in silence for a beat.

🎨 **Gemini prompt:** *A dynamic 2x2 storyboard of four phone screens showing the same app with four different triage outcomes — green fever, amber child's cold, amber stomach pain, and a bold red "SEE A DOCTOR" chest-pain alert with an emergency icon (112/108). Consistent flat UI, green-amber-red signal system, deep teal frame. The red panel visually emphasised/larger. 16:9.*

---

## Slide 6 — How It Works

### Rules override the LLM — by design, not by hope
- **Flow:** Browser (React + Web Speech) → Express API → **three parallel evaluators** → merge.
- The **red-flag engine** and **drug-interaction engine** run *in code* against curated datasets and can **force escalation**.
- The Groq-hosted LLM is an **advisor** — it adds warm, structured guidance, but the final signal is always the **most severe** of all sources.
- **The guarantee:** the AI can *raise* the alarm; it can **never lower** it. Unknown/garbled AI output fails safe to CAUTION.

```
  symptoms ─►┌──────────────────────┐
             │ 1. Red-flag rules     │─┐ can force SEE-A-DOCTOR
             │ 2. Drug/allergy DB    │─┼─► MERGE (most severe) ─► SAFE / CAUTION / DOCTOR
             │ 3. Groq LLM (advisory)│─┘    ▲ rules always win
             └──────────────────────┘
```

> **Presenter note:** This is the technical-credibility slide (Technical 25 + Innovation 25). Say the line slowly: "The AI can raise the alarm; it can never lower it."

🎨 **Gemini prompt:** *A clean technical architecture diagram, infographic style: a smartphone (voice input) flowing into a server box that splits into three labelled lanes — "Red-flag Rules", "Drug Interaction DB", and "Groq LLM (advisory)" — all converging into a single "Most-Severe Signal" gate that outputs a green/amber/red traffic-light result. Deep teal nodes, clean connector lines, isometric or flat-infographic style, minimal text labels. 16:9.*

---

## Slide 7 — Why It's Safe

### Safety is architecture, not a promise
- **Never prescribes** — no drug names or doses; enforced in the AI prompt **and** re-scrubbed by code (regex strips any leaked dosage or prescription drug).
- **Code-enforced red flags** — chest pain, stroke signs, severe bleeding, infant fever, breathing difficulty, suicidal ideation → forced doctor/helpline routing.
- **Human-in-the-loop** — a qualified pharmacist always makes the final call and can override.
- **Fails safe** — if the AI is down, rate-limited, or manipulated, the deterministic rails still protect the patient. Hardened with **prompt-injection defence, input sanitisation, security headers, rate limiting, and zero health-data persistence**.

> **Presenter note:** Pre-empt the judges' #1 objection ("isn't AI medical advice dangerous?"). Answer: "Yes — which is why the AI is the *junior* partner here, not the decision-maker."

🎨 **Gemini prompt:** *A reassuring "shield" concept illustration: a translucent protective shield made of layered hexagons (each labelled with a safety layer icon — a code bracket, a stethoscope/doctor, a lock) wrapping around a patient and pharmacist at a counter. Deep teal and green, calm and trustworthy, semi-flat vector with soft glow. Conveys "multiple layers of protection." Headline space top. 16:9.*

---

## Slide 8 — Innovation

### What makes Sahayak genuinely new
- **Counter-first, not phone-first** — built for the pharmacist's workflow, at the exact point where the decision is made. Most health apps target the patient at home; we target the moment of risk.
- **Vernacular voice as a first-class interface** — accessibility for low-literacy users, not an afterthought.
- **Safety-rails architecture** — deterministic guardrails that *override* an open LLM. This is **trustworthy AI**, a pattern any high-stakes domain can reuse.
- **Explainable by design** — every escalation shows the human-readable *reason*, so pharmacists and auditors can trust and verify it.

> **Presenter note:** This slide is pure Innovation-25 points. Emphasise the *reusable pattern*: "rules-override-LLM" is bigger than pharmacies.

🎨 **Gemini prompt:** *A bold concept illustration contrasting "phone-first health apps" (a lone person staring at a phone at home, greyed out) versus "counter-first Sahayak" (a vibrant, connected pharmacist-and-patient moment at the counter, in full color with teal/green highlights). Split composition, semi-flat vector, optimistic. Visual metaphor of meeting people where risk actually happens. 16:9.*

---

## Slide 9 — Tech Stack

### Lean, fast, and swappable
- **Frontend:** React + Vite + Tailwind CSS · **Web Speech API** for voice in/out.
- **Backend:** Node + Express — a single, auditable triage-orchestration endpoint.
- **AI:** **Groq** (OpenAI-compatible) for *low-latency* Llama inference — critical at a busy counter; provider-swappable via env vars.
- **Safety data & tests:** local JSON drug-interaction DB (50 Indian OTC drugs) + red-flag rules table; **Vitest** unit tests on the safety-critical logic (20 passing).
- **Ship-ready:** single-unit static serving, `helmet`/CSP hardening, multi-stage **Docker** image (non-root, healthcheck).

> **Presenter note:** Keep this fast — one line per layer. Mention "Groq gives us sub-second responses, which matters when a patient is standing right there."

🎨 **Gemini prompt:** *A clean, labelled tech-stack diagram as a vertical layered stack of rounded cards: "React + Vite + Tailwind (UI)", "Web Speech API (Voice)", "Node + Express (API)", "Safety Rules + Drug DB", "Groq LLM (Inference)", "Docker (Deploy)". Each card with a simple line icon, deep teal accent, modern flat infographic style, minimal and crisp. 16:9.*

---

## Slide 10 — Impact & Scale

### Every chemist shop is a deployment site
- **~1.2 million pharmacy counters** = 1.2 million potential install points. Runs in any browser, even on modest hardware — **zero new infrastructure**.
- **National stakes:** directly attacks **antibiotic resistance** by discouraging casual antibiotic demand and routing real infections to doctors.
- **Earlier emergency detection** → fewer preventable deaths and lower downstream treatment cost.
- **Rollout path:** pilot with a **pharmacy chain** → endorsement by **state pharmacy councils** → integration with India's **digital health rails (ABDM / e-pharmacy)**.

> **Presenter note:** Connect local-to-national: "One counter helps one family. 1.2 million counters move a national health metric."

🎨 **Gemini prompt:** *An uplifting map-of-India illustration with hundreds of small glowing teal/green dots lighting up across cities, towns, and rural areas — representing pharmacy counters activating Sahayak, spreading like a network. A few pulse outward to suggest national impact. Clean, optimistic, semi-flat infographic style, deep teal and green glow on a soft light background. Headline space top. 16:9.*

---

## Slide 11 — Roadmap

### From prototype to public-health infrastructure
- **Q1 — Deepen language coverage:** full UI localisation for all 12 supported languages (6 done) + dialect/accent tuning for voice. (Architecture is fully i18n-ready — adding a language is one config entry.)
- **Q2 — Real drug DB:** integrate a maintained national formulary / interaction database, replacing the demo dataset.
- **Q3 — Pharmacist dashboard:** consent-gated session history, escalation analytics, and a counter-level safety audit log.
- **Q4 — Regulatory pilot:** clinical validation with partner hospitals and a path toward CDSCO / medical-software compliance.

> **Presenter note:** Show momentum and seriousness — you have a credible path beyond the hackathon, not just a toy.

🎨 **Gemini prompt:** *A clean horizontal roadmap timeline with four milestone markers (Q1–Q4), each with a small icon: a language/globe, a database, an analytics dashboard, and a regulatory/checkmark shield. Deep teal path with green progress highlights, modern flat infographic, plenty of whitespace, minimal text. 16:9.*

---

## Slide 12 — Ask / Close

### Help us make 1.2 million counters safer
- **The framing (repeat):** *Sahayak turns every pharmacy counter into a safety net — triage, never prescribe.*
- **What's already real, today:** voice + vernacular, code-enforced red flags, live drug-interaction checks, Dockerised and demo-ready.
- **What we're seeking:** a **pharmacy-chain pilot partner**, **clinical advisors**, and a **drug-database data partner**.
- **The close:** *Let's route the right patients to a doctor — before it's too late.*

> **Presenter note:** End on the close line, then stop. Don't add anything after "before it's too late." Let it sit.

🎨 **Gemini prompt:** *A hopeful closing hero image: a pharmacist and a smiling patient shaking hands / sharing a reassured moment across the counter, with a subtle glowing green "SAFE" check and a teal Sahayak logo. Warm golden-hour lighting, deep teal and green palette, semi-flat vector, emotionally uplifting and trustworthy. Centered composition with space for the closing tagline. 16:9.*

---

## Appendix — Judging rubric crosswalk (for your own prep, not a slide)

| Rubric criterion | Where we score | Key line to say |
| --- | --- | --- |
| **Innovation (25)** | Slides 6, 8 | "Rules override the LLM — trustworthy AI, a reusable pattern." |
| **Technical (25)** | Slides 6, 7, 9 | "Deterministic safety engine + 20 passing tests + Dockerised." |
| **Problem-Solving (20)** | Slides 2, 3, 5 | "We catch the emergency the counter would have missed." |
| **UX (15)** | Slides 4, 5 | "Voice-first, vernacular, one clear colour-coded signal." |
| **Scalability/Impact (15)** | Slides 10, 11 | "1.2M counters, antibiotic resistance, ABDM rollout path." |

**60-second elevator version:** "In India the chemist is the first doctor for 900 million people — with no safety net. Sahayak is a voice-first triage co-pilot at the counter: speak your symptoms in your language, and it returns SAFE, CAUTION, or SEE-A-DOCTOR. The magic is the architecture — deterministic safety rules and a drug-interaction database run in code and *override* the AI, so a chest pain is escalated even if the model is wrong or offline. It never prescribes; a pharmacist stays in the loop. It's built, tested, hardened, and Dockerised today — and every one of India's 1.2 million pharmacy counters is a place we can deploy it."
