import { useEffect, useState } from "react";
import { useSpeech } from "./hooks/useSpeech.js";
import { STRINGS } from "./lib/strings.js";
import { getHealth, getScenarios, postTriage } from "./lib/api.js";
import ChipInput from "./components/ChipInput.jsx";
import ResultCard from "./components/ResultCard.jsx";

export default function App() {
  const [lang, setLang] = useState("en");
  const t = STRINGS[lang];

  // Form state — kept in memory only, cleared on reset (no persistence).
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [meds, setMeds] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [consent, setConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const [scenarios, setScenarios] = useState([]);
  const [health, setHealth] = useState(null);

  const speech = useSpeech(lang);

  // Load demo scenarios + backend health on mount.
  useEffect(() => {
    getScenarios().then((r) => setScenarios(r.scenarios)).catch(() => {});
    getHealth().then(setHealth).catch(() => {});
  }, []);

  const submit = async () => {
    setError("");
    if (!symptoms.trim()) {
      setError(lang === "hi" ? "कृपया लक्षण दर्ज करें।" : "Please describe the symptoms first.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const payload = {
        symptoms,
        language: lang,
        age: age ? Number(age) : undefined,
        currentMeds: meds,
        allergies,
        consent,
      };
      const r = await postTriage(payload);
      setResult(r);
      // Read the headline result aloud for the counter (voice-first).
      if (speech.ttsSupported) speech.speak(`${t.signals[r.signal]}. ${r.summary}`);
    } catch (e) {
      setError(e.message || "Triage failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    // Clears all in-memory session data — privacy by default.
    setSymptoms("");
    setAge("");
    setMeds([]);
    setAllergies([]);
    setConsent(false);
    setResult(null);
    setError("");
    speech.stopSpeaking();
  };

  const loadScenario = (s) => {
    reset();
    setLang(s.lang || "en");
    setSymptoms(s.input);
    setAge(s.age ? String(s.age) : "");
    setMeds(s.currentMeds || []);
    setAllergies(s.allergies || []);
  };

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-6">
      {/* Header */}
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-brand">
            Sahayak <span className="text-base font-medium text-slate-500">सहायक</span>
          </h1>
          <p className="mt-1 max-w-xl text-sm text-slate-600">{t.tagline}</p>
        </div>
        <div className="no-print flex items-center gap-2">
          <LangToggle lang={lang} setLang={setLang} />
        </div>
      </header>

      {/* LLM status banner (only when running rules-only) */}
      {health && !health.llmConfigured && (
        <div className="no-print mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {t.rulesOnly}
        </div>
      )}

      {/* Demo scenarios */}
      {scenarios.length > 0 && (
        <div className="no-print mb-6">
          <p className="mb-2 text-sm font-semibold text-slate-600">{t.demoTitle}</p>
          <div className="flex flex-wrap gap-2">
            {scenarios.map((s) => (
              <button
                key={s.id}
                onClick={() => loadScenario(s)}
                className="rounded-full border border-brand/30 bg-brand/5 px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand/10"
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input form */}
      <section className="no-print space-y-4 rounded-2xl bg-white p-5 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {t.symptomsLabel}
          </label>
          <div className="relative">
            <textarea
              value={speech.listening && speech.interim ? speech.interim : symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={3}
              placeholder={t.symptomsPlaceholder}
              maxLength={1000}
              className="w-full resize-none rounded-lg border border-slate-300 p-3 pr-28 text-base focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
            {speech.sttSupported && (
              <button
                onClick={() =>
                  speech.listening
                    ? speech.stopListening()
                    : speech.startListening((text) =>
                        setSymptoms((prev) => (prev ? `${prev} ${text}` : text)),
                      )
                }
                className={`absolute right-2 top-2 rounded-lg px-3 py-2 text-sm font-medium text-white ${
                  speech.listening ? "animate-pulse bg-danger" : "bg-brand"
                }`}
              >
                {speech.listening ? `● ${t.listening}` : `🎙 ${t.speak}`}
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{t.age}</label>
            <input
              type="number"
              min="0"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div className="sm:col-span-2">
            <ChipInput
              label={t.currentMeds}
              items={meds}
              onChange={setMeds}
              addLabel={t.addChip}
              placeholder="Crocin, Cetirizine…"
            />
          </div>
        </div>

        <ChipInput
          label={t.allergies}
          items={allergies}
          onChange={setAllergies}
          addLabel={t.addChip}
          placeholder="penicillin, NSAID…"
        />

        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5"
          />
          {t.consent}
        </label>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 rounded-xl bg-brand px-4 py-3 text-base font-bold text-white shadow hover:bg-teal-800 disabled:opacity-60"
          >
            {loading ? t.analyzing : t.triage}
          </button>
          <button
            onClick={reset}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-medium hover:bg-slate-100"
          >
            {t.reset}
          </button>
        </div>
      </section>

      {/* Result */}
      <div className="mt-6">
        <ResultCard
          result={result}
          t={t}
          onSpeak={speech.speak}
          onPrint={() => window.print()}
          canSpeak={speech.ttsSupported}
        />
      </div>

      <footer className="no-print mt-10 text-center text-xs text-slate-400">
        Sahayak triages and routes — it never prescribes. Built for safer pharmacy counters.
      </footer>
    </div>
  );
}

function LangToggle({ lang, setLang }) {
  return (
    <div className="flex overflow-hidden rounded-lg border border-slate-300">
      {["en", "hi"].map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1.5 text-sm font-medium ${
            lang === l ? "bg-brand text-white" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          {l === "en" ? "EN" : "हिं"}
        </button>
      ))}
    </div>
  );
}
