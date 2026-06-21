/**
 * Large, colour-coded triage signal. The colour mapping is the visual heart of
 * the demo: green = safe, amber = caution, red = see a doctor.
 */
const STYLES = {
  SAFE: { bg: "bg-safe", ring: "ring-green-200", icon: "✓" },
  CAUTION: { bg: "bg-caution", ring: "ring-amber-200", icon: "!" },
  SEE_A_DOCTOR: { bg: "bg-danger", ring: "ring-red-200", icon: "✚" },
};

export default function SignalBadge({ signal, label }) {
  const s = STYLES[signal] || STYLES.CAUTION;
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl ${s.bg} px-5 py-4 text-white shadow-lg ring-4 ${s.ring}`}
      role="status"
      aria-label={`Triage result: ${label}`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/25 text-2xl font-bold">
        {s.icon}
      </span>
      <span className="text-2xl font-bold tracking-wide">{label}</span>
    </div>
  );
}
