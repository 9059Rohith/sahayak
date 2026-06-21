import SignalBadge from "./SignalBadge.jsx";

/**
 * Renders the triage result + the printable summary.
 *
 * Security note: every dynamic string is rendered as React text (never
 * dangerouslySetInnerHTML), so output is XSS-safe by construction.
 */
export default function ResultCard({ result, t, onSpeak, onPrint, canSpeak }) {
  if (!result) return null;
  const { signal, summary, followUpQuestions, otcGuidance, safetyReasons, emergencyAdvice, meta } =
    result;
  const label = t.signals[signal] || signal;

  return (
    <section className="space-y-4" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SignalBadge signal={signal} label={label} />
        <div className="flex gap-2 no-print">
          {canSpeak && (
            <button
              onClick={() => onSpeak(summary)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-100"
            >
              🔊 {t.listen}
            </button>
          )}
          <button
            onClick={onPrint}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-100"
          >
            🖨 {t.print}
          </button>
        </div>
      </div>

      {/* Patient summary */}
      <p className="rounded-xl bg-white p-4 text-lg leading-relaxed shadow-sm">{summary}</p>

      {/* Emergency guidance (red flags) */}
      {emergencyAdvice?.length > 0 && (
        <Panel title={t.emergency} tone="danger">
          <ul className="list-disc space-y-1 pl-5">
            {emergencyAdvice.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Panel>
      )}

      {/* OTC self-care */}
      {otcGuidance?.length > 0 && (
        <Panel title={t.otc} tone="safe">
          <ul className="list-disc space-y-1 pl-5">
            {otcGuidance.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </Panel>
      )}

      {/* Follow-up questions */}
      {followUpQuestions?.length > 0 && (
        <Panel title={t.followUps} tone="neutral">
          <ul className="list-disc space-y-1 pl-5">
            {followUpQuestions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </Panel>
      )}

      {/* Deterministic safety checks — the trust-building "why" */}
      {safetyReasons?.length > 0 && (
        <Panel title={t.safetyReasons} tone="caution">
          <ul className="space-y-1">
            {safetyReasons.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="rounded bg-slate-200 px-1.5 py-0.5 text-xs font-semibold uppercase">
                  {r.source}
                </span>
                <span>{r.label || r.advice}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {/* Disclaimer */}
      <div className="rounded-xl border border-slate-200 bg-slate-100 p-3 text-sm text-slate-600">
        <strong>{t.disclaimerTitle}:</strong> {meta.disclaimer}
        <span className="ml-1 text-slate-400">
          ({meta.llmUsed ? `model: ${meta.model}` : "rules-only"})
        </span>
      </div>
    </section>
  );
}

function Panel({ title, tone, children }) {
  const toneClass = {
    danger: "border-red-200 bg-red-50",
    safe: "border-green-200 bg-green-50",
    caution: "border-amber-200 bg-amber-50",
    neutral: "border-slate-200 bg-white",
  }[tone];
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${toneClass}`}>
      <h3 className="mb-2 font-semibold text-slate-800">{title}</h3>
      <div className="text-slate-700">{children}</div>
    </div>
  );
}
