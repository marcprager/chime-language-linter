import { forwardRef } from 'react';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  isDebouncing: boolean;
}

const TextEditor = forwardRef<HTMLTextAreaElement | null, TextEditorProps>(
  ({ value, onChange, isDebouncing }, ref) => {
    return (
      <div className="relative mb-5">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste or type your content here to get instant feedback..."
          className="w-full min-h-[320px] p-5 bg-white border border-slate-200 rounded-xl shadow-card resize-y placeholder-slate-300 transition-all duration-200 text-slate-800"
          spellCheck={false}
          aria-label="Content to lint"
        />
        {isDebouncing && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-chime-400 animate-pulse-soft" />
            Analyzing...
          </div>
        )}
      </div>
    );
  },
);

TextEditor.displayName = 'TextEditor';

export default TextEditor;
