# 🎬 Sahayak — Video Presentation Script

> **Live demo:** https://sahayak-hj7q.onrender.com
> **Repo:** https://github.com/9059Rohith/sahayak
> **Framing line (say it 3×):** *"Making India's 1.2 million pharmacy counters safer."*

This file has everything you need to record a winning demo video:
- A **3-minute main script** (recommended for submission) — shot-by-shot, with exact voiceover and on-screen actions, time-aligned.
- A **60-second elevator cut** (for reels / time-limited rounds).
- A **recording checklist** and **pro tips**.

Legend: **🎙 SAY** = what you say · **🖥 SHOW** = what's on screen / what you click · **⏱** = running time.

---

## 🎯 The 3-minute main script (target 3:00)

### Segment 1 — The Hook (0:00 – 0:25) ⏱ 25s
**🖥 SHOW:** Your face on camera, or a title slide: "Sahayak — सहायक".

> **🎙 SAY:**
> "In India, when someone falls sick, their first stop usually isn't a doctor — it's the local chemist. For nine hundred million people, the pharmacist *is* the first doctor.
> But that pharmacist has no safety net. A heart attack gets mistaken for gas. Antibiotics get handed out casually. People get hurt.
> We built **Sahayak** to fix exactly that moment."

**Pro tip:** Speak the first sentence slowly. Hook first, name second.

---

### Segment 2 — What Sahayak Is (0:25 – 0:45) ⏱ 20s
**🖥 SHOW:** The live app homepage at sahayak-hj7q.onrender.com. Slowly move the cursor over the mic button and the language dropdown.

> **🎙 SAY:**
> "Sahayak is a voice-first AI triage assistant for the pharmacy counter. You speak your symptoms in your own language — we support **twelve Indian languages** — and it gives one clear answer: **Safe, Caution, or See a Doctor**.
> The golden rule: **it triages, it never prescribes.**"

---

### Segment 3 — Live Demo: the everyday case (0:45 – 1:15) ⏱ 30s
**🖥 SHOW:** Click the **"Common fever"** demo chip → click **Get triage**. Let the colored signal appear; let the voice read it aloud.

> **🎙 SAY:**
> "Let's try a common case — a mild fever. I'll tap the scenario and run the triage.
> *(result appears)* Sahayak returns **Caution** — green-amber — with sensible self-care: rest, fluids, an over-the-counter fever reducer, and a clear note to see a doctor if it lasts more than three days. Notice — **no drug names, no doses.** Just safe guidance.
> And it reads the result aloud, so it works even for someone who can't read."

---

### Segment 4 — The Money Moment: the red flag (1:15 – 1:50) ⏱ 35s
**🖥 SHOW:** Click **"Chest pain"** demo chip → **Get triage**. Let the big **red SEE-A-DOCTOR** screen and the emergency numbers land. Pause in silence for one beat.

> **🎙 SAY:**
> "Now the case that matters most. Someone says they have severe chest pain spreading to their left arm.
> *(red screen appears — pause)*
> **Instantly: See a Doctor.** Call 112. This is the heart of Sahayak — and here's the part judges should remember:
> this decision was **not** made by the AI. It was forced by a **deterministic safety rule running in code.** Even if the AI is wrong, offline, or someone tries to trick it — this red flag *cannot* be missed."

**Pro tip:** This is your highest-scoring 35 seconds. Slow down. Let the red screen breathe.

---

### Segment 5 — Safety in depth: the drug check (1:50 – 2:15) ⏱ 25s
**🖥 SHOW:** On any case, type **Crocin** in "current medicines", press Add, then **Dolo**, press Add → **Get triage**.

> **🎙 SAY:**
> "It also checks medicines. Watch — I'll add two common brands, Crocin and Dolo.
> *(result)* Sahayak flags it: both contain paracetamol — taking them together risks a **liver-damaging overdose.** Again, that's caught by our drug-interaction engine **in code**, not guesswork. Rules override the AI, every time."

---

### Segment 6 — How it works (2:15 – 2:40) ⏱ 25s
**🖥 SHOW:** The architecture diagram (from ARCHITECTURE.md or a slide): symptoms → [Red-flag rules + Drug DB + LLM] → most-severe signal.

> **🎙 SAY:**
> "Under the hood, three things run in parallel: a deterministic red-flag engine, a drug-interaction database, and a low-latency LLM on Groq.
> They merge to the **most severe** signal — so the AI can *raise* the alarm, but it can **never lower** it. That's trustworthy AI by architecture, not by hope.
> It's built, tested with twenty passing safety tests, hardened, and Dockerised — and it's **live right now.**"

---

### Segment 7 — Impact & Close (2:40 – 3:00) ⏱ 20s
**🖥 SHOW:** Back to your face, or a closing slide with the tagline + the live URL.

> **🎙 SAY:**
> "Every one of India's **1.2 million** pharmacy counters is a place we can deploy this — fighting antibiotic resistance and catching emergencies earlier, in twelve languages, on any browser.
> Sahayak turns every pharmacy counter into a safety net. **It triages. It never prescribes.**
> Let's route the right patients to a doctor — before it's too late. Thank you."

**🛑 STOP.** Don't speak after "Thank you."

---

## ⚡ The 60-second elevator cut

**🖥 SHOW:** App live throughout; end on the red chest-pain screen.

> "In India, the chemist is the first doctor for 900 million people — with no safety net.
> **Sahayak** is a voice-first triage co-pilot for the pharmacy counter. Speak your symptoms in any of **twelve Indian languages**, and it answers: **Safe, Caution, or See a Doctor.**
> *(tap Common fever)* A fever? Safe self-care, no prescriptions.
> *(tap Chest pain — red screen)* Chest pain? **Instantly: See a Doctor** — and that's forced by a safety rule in code, so even if the AI fails, the emergency is never missed.
> It never prescribes, a pharmacist stays in the loop, and it's **live and Dockerised today.**
> 1.2 million counters. Twelve languages. One clear signal.
> **Sahayak — making India's pharmacy counters safer.**"

---

## ✅ Recording checklist (do this before you hit record)

1. **Wake the live app first.** Open https://sahayak-hj7q.onrender.com once ~1 minute before recording (the free host sleeps; the first load can take ~30s).
2. **Verify the build is current:** open `/api/health` → should show `"languages":12`.
3. **Use Google Chrome** — best Web Speech (voice) support; allow microphone access if you'll demo voice.
4. **Pre-load the demo chips** so each scenario is one click.
5. **Zoom the browser to ~125%** so the colored signal and text are clearly visible on video.
6. **Close other tabs / notifications.** Clean screen = professional.
7. **Record in 1080p.** Screen-record the browser; picture-in-picture webcam optional.
8. Keep total length **at or under the round's limit** (most prototype rounds want ≤ 3 min).

## 🎤 Delivery pro tips
- **Energy in the first 10 seconds** decides whether judges lean in. Hook, don't introduce.
- **Pause after the red chest-pain screen.** Silence sells the safety story.
- Say the phrase **"rules override the AI"** at least twice — it's your differentiator.
- End exactly on the tagline. No trailing "umm, yeah, that's it."
- If voice STT is flaky on the day, **use the demo chips / typed input** — they always work. Don't gamble the demo on a live mic.

## 🗂 Suggested shot order if recording in pieces
Talking-head intro → screen-capture of segments 3–5 (the live demo) → architecture slide (segment 6) → talking-head close. Edit together; add soft background music under the voiceover at ~15% volume.
