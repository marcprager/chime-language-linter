import { useLinter } from './hooks/useLinter';
import Header from './components/Header';
import TextEditor from './components/TextEditor';
import SummaryBar from './components/SummaryBar';
import Toolbar from './components/Toolbar';
import IssueList from './components/IssueList';
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
    copyFeedback,
    isDebouncing,
    textareaRef,
    handleIssueClick,
    handleFixSingle,
    handleFixAll,
    handleCopyClean,
    wordCount,
    charCount,
  } = useLinter();

  const hasText = text.trim().length > 0;
  const summary = result?.summary ?? { errors: 0, warnings: 0, info: 0 };
  const totalIssues = summary.errors + summary.warnings + summary.info;

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
                  copyFeedback={copyFeedback}
                  onFixAll={handleFixAll}
                  onCopyClean={handleCopyClean}
                />

                <IssueList
                  issues={filteredIssues}
                  onIssueClick={handleIssueClick}
                  onFix={handleFixSingle}
                />
              </>
            )}

            {totalIssues === 0 && <SuccessState />}
          </>
        )}

        {/* Empty state */}
        {!hasText && <EmptyState />}
      </div>
    </div>
  );
}
