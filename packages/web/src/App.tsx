import { useLinter } from './hooks/useLinter';
import Header from './components/Header';
import TextEditor from './components/TextEditor';
import SummaryBar from './components/SummaryBar';
import Toolbar from './components/Toolbar';
import IssueList from './components/IssueList';
import PolishedPreview from './components/PolishedPreview';
import EmptyState from './components/EmptyState';
import SuccessState from './components/SuccessState';

export default function App() {
  const {
    text,
    setText,
    result,
    filter,
    setFilter,
    filteredIssues,
    score,
    autoFixableCount,
    isDebouncing,
    polishedText,
    textareaRef,
    handleIssueClick,
    handleFixSingle,
    handleFixAll,
    wordCount,
    charCount,
  } = useLinter();

  const hasText = text.trim().length > 0;
  const summary = result?.summary ?? { errors: 0, warnings: 0, info: 0 };
  const totalIssues = summary.errors + summary.warnings + summary.info;
  const hasPolishedChanges = hasText && polishedText !== text;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Header
          wordCount={wordCount}
          charCount={charCount}
          hasText={hasText}
        />

        <TextEditor
          ref={textareaRef}
          value={text}
          onChange={setText}
          isDebouncing={isDebouncing}
        />

        {/* Summary + Toolbar + Issues: shown when there's text */}
        {hasText && result && (
          <>
            <SummaryBar
              score={score}
              errors={summary.errors}
              warnings={summary.warnings}
              info={summary.info}
            />

            {totalIssues > 0 && (
              <>
                <Toolbar
                  filter={filter}
                  onFilterChange={setFilter}
                  errors={summary.errors}
                  warnings={summary.warnings}
                  info={summary.info}
                  autoFixableCount={autoFixableCount}
                  onFixAll={handleFixAll}
                />

                <IssueList
                  issues={filteredIssues}
                  onIssueClick={handleIssueClick}
                  onFix={handleFixSingle}
                />
              </>
            )}

            {/* Polished text preview */}
            {hasPolishedChanges && (
              <PolishedPreview polishedText={polishedText} />
            )}

            {totalIssues === 0 && <SuccessState />}
          </>
        )}

        {/* Empty state */}
        {!hasText && <EmptyState />}

        {/* Privacy footer */}
        <footer className="mt-12 pt-6 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-400">
            <svg className="w-3 h-3 inline-block mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Your content stays in your browser &ndash; nothing is sent to any server.
          </p>
        </footer>
      </div>
    </div>
  );
}
