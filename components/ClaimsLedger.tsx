import React, { useState } from 'react';
import type { ResearchClaim, ClaimStatus, ClaimRisk } from '../src/domain/ResearchPack';
import type { UseClaimsReturn } from '../src/features/claims/useClaims';

interface ClaimsLedgerProps {
  claims: UseClaimsReturn;
  availableSourceIds: string[];
}

const STATUSES: ClaimStatus[] = ['unverified', 'verified', 'contested', 'outdated'];
const RISKS: ClaimRisk[] = ['low', 'medium', 'high'];

export const ClaimsLedger: React.FC<ClaimsLedgerProps> = ({ claims, availableSourceIds }) => {
  const [text, setText] = useState('');
  const [sourceIds, setSourceIds] = useState<string[]>([]);
  const [status, setStatus] = useState<ClaimStatus>('unverified');
  const [risk, setRisk] = useState<ClaimRisk>('medium');

  const handleAdd = async () => {
    if (!text.trim()) return;
    await claims.addClaim({
      text: text.trim(),
      sourceIds,
      status,
      risk,
      usedIn: [],
    });
    setText('');
    setSourceIds([]);
  };

  const toggleSource = (id: string) => {
    setSourceIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const allClaims: ResearchClaim[] = claims.claims;

  return (
    <div className="claims-ledger">
      <h3>Claim Ledger</h3>
      {claims.error && <div className="error">{claims.error}</div>}
      <div className="add-claim-form">
        <textarea
          placeholder="Nội dung claim..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="source-picker">
          <label>Sources:</label>
          {availableSourceIds.map((id) => (
            <label key={id}>
              <input
                type="checkbox"
                checked={sourceIds.includes(id)}
                onChange={() => toggleSource(id)}
              />
              {id.slice(0, 12)}…
            </label>
          ))}
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value as ClaimStatus)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={risk} onChange={(e) => setRisk(e.target.value as ClaimRisk)}>
          {RISKS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <button type="button" onClick={handleAdd}>Thêm claim</button>
      </div>
      <ul>
        {allClaims.map((c) => (
          <li key={c.id}>
            <span className={`status status-${c.status}`}>[{c.status}]</span>
            <span className={`risk risk-${c.risk}`}>[{c.risk}]</span>
            {c.text}
            <small>({c.sourceIds.length} nguồn)</small>
            <button type="button" onClick={() => claims.deleteClaim(c.id)}>Xoá</button>
          </li>
        ))}
      </ul>
    </div>
  );
};