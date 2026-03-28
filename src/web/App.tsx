import { useState, useCallback, useRef } from "react";
import { lint } from "../core/index.js";
import type { LintResult, LintIssue } from "../core/index.js";

const PLACEHOLDER = `Paste or type your content here\u2026

Example: Research shows that 70% of employees struggle with feedback.
Our proprietary SBI framework helps drivers become rockstars.
The lowest score on the team\u2014a real dumpster fire\u2014needs ego work.`;

export function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<LintResult | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleLint = useCallback(() => {
    if (!text.trim()) return;
    setResult(lint(text));
  }, [text]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        setText(content);
        setResult(lint(content));
      };
      reader.readAsText(file);
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleLint();
      }
    },
    [handleLint],
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Chime Language Linter</h1>
        <p style={styles.subtitle}>
          Content style checker for People Development materials
        </p>
      </header>

      <main style={styles.main}>
        <div style={styles.inputSection}>
          <div style={styles.inputHeader}>
            <label htmlFor="content-input" style={styles.label}>
              Content to lint
            </label>
            <label style={styles.uploadBtn}>
              Upload file
              <input
                type="file"
                accept=".txt,.md,.text"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <textarea
            ref={textareaRef}
            id="content-input"
            style={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={PLACEHOLDER}
            spellCheck={false}
          />
          <div style={styles.actions}>
            <button
              onClick={handleLint}
              style={styles.button}
              disabled={!text.trim()}
            >
              Lint content
            </button>
            <span style={styles.hint}>Ctrl+Enter / Cmd+Enter</span>
          </div>
        </div>

        {result && <ResultsPanel result={result} text={text} />}
      </main>
    </div>
  );
}

function ResultsPanel({
  result,
  text,
}: {
  result: LintResult;
  text: string;
}) {
  const lines = text.split("\n");

  return (
    <div style={styles.results}>
      <ScoreBadge score={result.score} />
      <p style={styles.summary}>{result.summary}</p>

      {result.issues.length === 0 ? (
        <p style={styles.noIssues}>No issues found \u2013 content looks great!</p>
      ) : (
        <div style={styles.issueList}>
          {result.issues.map((issue, i) => (
            <IssueCard key={i} issue={issue} sourceLine={lines[issue.line - 1]} />
          ))}
        </div>
      )}
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? "#16a34a" : score >= 50 ? "#ca8a04" : "#dc2626";
  return (
    <div style={{ ...styles.scoreBadge, borderColor: color }}>
      <span style={{ ...styles.scoreNumber, color }}>{score}</span>
      <span style={styles.scoreLabel}>/ 100</span>
    </div>
  );
}

function IssueCard({
  issue,
  sourceLine,
}: {
  issue: LintIssue;
  sourceLine?: string;
}) {
  const isError = issue.severity === "error";
  const badgeStyle = isError ? styles.errorBadge : styles.warnBadge;

  return (
    <div style={styles.issueCard}>
      <div style={styles.issueHeader}>
        <span style={badgeStyle}>
          {isError ? "ERROR" : "WARN"}
        </span>
        <span style={styles.issueLocation}>
          {issue.line}:{issue.column}
        </span>
        <span style={styles.issueRule}>{issue.rule}</span>
      </div>
      <p style={styles.issueMessage}>{issue.message}</p>
      {issue.suggestion && (
        <p style={styles.issueSuggestion}>{"\u21b3 "}{issue.suggestion}</p>
      )}
      {sourceLine !== undefined && (
        <div style={styles.sourceBlock}>
          <code style={styles.sourceLine}>{sourceLine}</code>
          <code style={styles.sourcePointer}>
            {" ".repeat(Math.max(0, issue.column - 1))}
            {"~".repeat(issue.length)}
          </code>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: 860,
    margin: "0 auto",
    padding: "24px 16px",
    color: "#1a1a1a",
    backgroundColor: "#fafafa",
    minHeight: "100vh",
  },
  header: {
    marginBottom: 24,
    borderBottom: "2px solid #e5e5e5",
    paddingBottom: 16,
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
  },
  subtitle: {
    margin: "4px 0 0",
    color: "#666",
    fontSize: 14,
  },
  main: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  inputSection: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  inputHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontWeight: 600,
    fontSize: 14,
  },
  uploadBtn: {
    fontSize: 13,
    color: "#2563eb",
    cursor: "pointer",
    textDecoration: "underline",
  },
  textarea: {
    width: "100%",
    minHeight: 200,
    padding: 12,
    fontSize: 14,
    fontFamily: '"SF Mono", "Fira Code", "Consolas", monospace',
    border: "1px solid #d1d5db",
    borderRadius: 6,
    resize: "vertical",
    lineHeight: 1.6,
    boxSizing: "border-box",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  button: {
    padding: "8px 20px",
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
    backgroundColor: "#2563eb",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  hint: {
    fontSize: 12,
    color: "#999",
  },
  results: {
    padding: 16,
    backgroundColor: "#fff",
    border: "1px solid #e5e5e5",
    borderRadius: 8,
  },
  scoreBadge: {
    display: "inline-flex",
    alignItems: "baseline",
    gap: 4,
    padding: "6px 14px",
    border: "2px solid",
    borderRadius: 8,
    marginBottom: 12,
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: 700,
  },
  scoreLabel: {
    fontSize: 14,
    color: "#666",
  },
  summary: {
    fontSize: 14,
    color: "#444",
    margin: "0 0 16px",
  },
  noIssues: {
    fontSize: 16,
    color: "#16a34a",
    fontWeight: 600,
  },
  issueList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  issueCard: {
    padding: 12,
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 6,
  },
  issueHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  errorBadge: {
    fontSize: 11,
    fontWeight: 700,
    color: "#fff",
    backgroundColor: "#dc2626",
    padding: "1px 6px",
    borderRadius: 3,
  },
  warnBadge: {
    fontSize: 11,
    fontWeight: 700,
    color: "#fff",
    backgroundColor: "#ca8a04",
    padding: "1px 6px",
    borderRadius: 3,
  },
  issueLocation: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#666",
  },
  issueRule: {
    fontSize: 12,
    color: "#999",
    marginLeft: "auto",
  },
  issueMessage: {
    margin: "0 0 4px",
    fontSize: 14,
  },
  issueSuggestion: {
    margin: "0 0 8px",
    fontSize: 13,
    color: "#2563eb",
  },
  sourceBlock: {
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderRadius: 4,
    overflow: "auto",
  },
  sourceLine: {
    display: "block",
    fontSize: 12,
    fontFamily: "monospace",
    whiteSpace: "pre",
    color: "#374151",
  },
  sourcePointer: {
    display: "block",
    fontSize: 12,
    fontFamily: "monospace",
    whiteSpace: "pre",
    color: "#dc2626",
  },
};
