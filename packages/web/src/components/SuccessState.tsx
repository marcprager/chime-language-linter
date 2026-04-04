import ScoreRing from './ScoreRing';

export default function SuccessState() {
  return (
    <div className="text-center py-14 animate-scale-in relative overflow-hidden">
      {/* Confetti dots */}
      <div className="confetti-dot bg-chime-300" style={{ top: '10%', left: '20%' }} />
      <div className="confetti-dot bg-amber-300" style={{ top: '15%', right: '25%' }} />
      <div className="confetti-dot bg-blue-300" style={{ bottom: '20%', left: '30%' }} />
      <div className="confetti-dot bg-chime-400" style={{ top: '25%', right: '15%' }} />
      <div className="confetti-dot bg-emerald-300" style={{ bottom: '15%', right: '35%' }} />

      <div className="mb-4">
        <ScoreRing score={100} size={72} />
      </div>

      {/* Animated checkmark */}
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-chime-50 mb-4">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            className="check-path drawn"
            d="M7 14.5L12 19.5L21 9.5"
            stroke="#00D54B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p className="text-base font-semibold text-chime-700 mb-1">
        Looking great!
      </p>
      <p className="text-sm text-slate-500 max-w-sm mx-auto">
        Your content is clear, inclusive, and on-brand. Nice work.
      </p>
    </div>
  );
}
