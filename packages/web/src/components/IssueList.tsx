import { LintIssue } from '@chime-linter/core';
import IssueCard from './IssueCard';

interface IssueListProps {
  issues: LintIssue[];
  onIssueClick: (issue: LintIssue) => void;
  onFix: (issue: LintIssue) => void;
}

export default function IssueList({ issues, onIssueClick, onFix }: IssueListProps) {
  if (issues.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-slate-400 animate-fade-in-up">
        No issues match this filter.
      </div>
    );
  }

  return (
    <div className="issues-list space-y-2.5 max-h-[600px] overflow-y-auto pr-1" role="list">
      {issues.map((issue, i) => (
        <div key={`${issue.line}-${issue.column}-${issue.rule}-${i}`} role="listitem">
          <IssueCard
            issue={issue}
            onIssueClick={onIssueClick}
            onFix={onFix}
          />
        </div>
      ))}
    </div>
  );
}
