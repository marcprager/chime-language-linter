import { useState } from 'react';

interface PolishedPreviewProps {
  polishedText: string;
}

export default function PolishedPreview({ polishedText }: PolishedPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(polishedText);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = polishedText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Polished version</h3>
          <p className="text-[11px] text-slate-400">
            Auto-fixable changes applied &ndash; review and copy
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-chime-600 text-white text-xs font-semibold rounded-lg hover:bg-chime-700 active:bg-chime-800 transition-colors shadow-sm"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy Polished Text
            </>
          )}
        </button>
      </div>
      <div className="p-4 bg-chime-50/50 border border-chime-200 rounded-xl text-sm text-slate-700 leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto">
        {polishedText}
      </div>
    </div>
  );
}
