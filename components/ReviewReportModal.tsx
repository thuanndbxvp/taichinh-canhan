import React, { useState } from 'react';
import type { UseReviewGateReturn } from '../src/features/review/useReviewGate';
import type { ReviewSeverity, ReviewIssue } from '../src/domain/review/ReviewReport';

interface ReviewReportModalProps {
  gate: UseReviewGateReturn;
  onClose: () => void;
  onJumpToScene?: (sceneId: string) => void;
}

const SEVERITY_FILTERS: ReviewSeverity[] = ['critical', 'major', 'minor'];

export const ReviewReportModal: React.FC<ReviewReportModalProps> = ({
  gate,
  onClose,
  onJumpToScene,
}) => {
  const [severityFilter, setSeverityFilter] = useState<ReviewSeverity | 'all'>('all');

  if (!gate.report) {
    return (
      <div className="modal review-modal">
        <h3>Review Report</h3>
        {gate.error && <div className="error">{gate.error}</div>}
        <p>Chưa có report. Bấm "Chạy review" để tạo.</p>
        <div className="modal-actions">
          <button type="button" onClick={() => gate.run()} disabled={gate.isRunning}>
            {gate.isRunning ? 'Đang chạy...' : 'Chạy review'}
          </button>
          <button type="button" onClick={onClose}>Đóng</button>
        </div>
      </div>
    );
  }

  const r = gate.report;
  const filtered: ReviewIssue[] =
    severityFilter === 'all'
      ? gate.sortedIssues
      : gate.sortedIssues.filter((i) => i.severity === severityFilter);

  return (
    <div className="modal review-modal">
      <h3>Review Report</h3>
      <div className={`overall-banner ${r.passed ? 'pass' : 'fail'}`}>
        <span className="score">{r.scores.overall}/100</span>
        <span className="status">{r.passed ? 'PASS' : 'BLOCKED'}</span>
        <span className="blocking">{r.blockingIssueCount} blocking</span>
      </div>
      <div className="score-grid">
        <ScoreCell label="Fact" score={r.scores.fact} />
        <ScoreCell label="Math" score={r.scores.math} />
        <ScoreCell label="Risk" score={r.scores.risk} />
        <ScoreCell label="Retention" score={r.scores.retention} />
        <ScoreCell label="Clarity" score={r.scores.clarity} />
        <ScoreCell label="Brand" score={r.scores.brand} />
        <ScoreCell label="Actionability" score={r.scores.actionability} />
      </div>
      <div className="severity-filter">
        <label>Filter:</label>
        <button
          type="button"
          className={severityFilter === 'all' ? 'active' : ''}
          onClick={() => setSeverityFilter('all')}
        >
          Tất cả ({r.issues.length})
        </button>
        {SEVERITY_FILTERS.map((s) => (
          <button
            key={s}
            type="button"
            className={severityFilter === s ? 'active' : ''}
            onClick={() => setSeverityFilter(s)}
          >
            {s} ({r.summary.bySeverity[s]})
          </button>
        ))}
      </div>
      <ul className="issues-list">
        {filtered.map((issue) => (
          <li key={issue.issueId} className={`severity-${issue.severity}`}>
            <div className="issue-header">
              <span className="cat">[{issue.category}]</span>
              <span className="sev">[{issue.severity}]</span>
              {issue.sceneId && onJumpToScene && (
                <button
                  type="button"
                  onClick={() => onJumpToScene(issue.sceneId!)}
                  className="jump"
                >
                  → scene
                </button>
              )}
            </div>
            <div className="message">{issue.message}</div>
            {issue.suggestedFix && (
              <div className="fix"><strong>Gợi ý:</strong> {issue.suggestedFix}</div>
            )}
          </li>
        ))}
      </ul>
      <div className="modal-actions">
        <button type="button" onClick={() => gate.run()} disabled={gate.isRunning}>
          Chạy lại
        </button>
        <button type="button" onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

const ScoreCell: React.FC<{ label: string; score: number }> = ({ label, score }) => (
  <div className={`score-cell ${score >= 70 ? 'good' : score >= 50 ? 'warn' : 'bad'}`}>
    <div className="label">{label}</div>
    <div className="score">{score}</div>
  </div>
);