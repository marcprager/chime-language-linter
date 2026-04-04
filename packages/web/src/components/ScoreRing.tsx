interface ScoreRingProps {
  score: number;
  size?: number;
}

export default function ScoreRing({ score, size = 80 }: ScoreRingProps) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80
      ? 'stroke-chime-500'
      : score >= 50
        ? 'stroke-amber-400'
        : 'stroke-red-400';

  const textColor =
    score >= 80
      ? 'text-chime-600'
      : score >= 50
        ? 'text-amber-500'
        : 'text-red-500';

  const bgRing =
    score >= 80
      ? 'stroke-chime-100'
      : score >= 50
        ? 'stroke-amber-100'
        : 'stroke-red-100';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={bgRing}
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={`score-ring-circle ${color}`}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className={`absolute text-lg font-bold ${textColor}`}>
        {score}
      </span>
    </div>
  );
}
