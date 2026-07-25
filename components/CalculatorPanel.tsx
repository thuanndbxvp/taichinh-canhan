import React, { useState } from 'react';
import {
  buildCalculation,
  type CalcKind,
  type Calculation,
} from '../src/domain/Calculator';
import type { UseSceneEditorReturn } from '../src/features/scenes/useSceneEditor';

interface CalculatorPanelProps {
  editor: UseSceneEditorReturn;
}

const CALC_KINDS: CalcKind[] = [
  'compound-interest',
  'simple-interest',
  'monthly-savings',
  'inflation-adjust',
  'opportunity-cost',
  'fee-impact',
];

export const CalculatorPanel: React.FC<CalculatorPanelProps> = ({ editor }) => {
  const [kind, setKind] = useState<CalcKind>('compound-interest');
  const [title, setTitle] = useState('');
  const [principal, setPrincipal] = useState('10000000');
  const [monthly, setMonthly] = useState('500000');
  const [annualRate, setAnnualRate] = useState('8');
  const [years, setYears] = useState('10');
  const [inflation, setInflation] = useState('4');
  const [fee, setFee] = useState('1.5');
  const [lastResult, setLastResult] = useState<Calculation | null>(null);

  const handleCalc = async () => {
    const calc = buildCalculation(kind, title || kind, {
      principal: Number(principal),
      monthly: Number(monthly),
      annualRate: Number(annualRate),
      years: Number(years),
      inflation: Number(inflation),
      fee: Number(fee),
    });
    setLastResult(calc);
    // Bind vào scene đầu tiên nếu có.
    if (editor.scenes.length > 0) {
      const firstScene = editor.scenes[0];
      await editor.linkCalculation(firstScene.id, calc.id);
    }
  };

  const fmt = (v: number, unit: string) =>
    unit === '%' ? `${v}%` : new Intl.NumberFormat('vi-VN').format(v);

  return (
    <div className="calculator-panel">
      <h3>Finance Calculator</h3>
      <div className="calc-form">
        <select value={kind} onChange={(e) => setKind(e.target.value as CalcKind)}>
          {CALC_KINDS.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
        <input placeholder="Tiêu đề" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label>Principal (VND) <input value={principal} onChange={(e) => setPrincipal(e.target.value)} /></label>
        <label>Monthly (VND) <input value={monthly} onChange={(e) => setMonthly(e.target.value)} /></label>
        <label>Annual rate (%) <input value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} /></label>
        <label>Years <input value={years} onChange={(e) => setYears(e.target.value)} /></label>
        <label>Inflation (%) <input value={inflation} onChange={(e) => setInflation(e.target.value)} /></label>
        <label>Fee (%) <input value={fee} onChange={(e) => setFee(e.target.value)} /></label>
        <button type="button" onClick={handleCalc}>Tính</button>
      </div>
      {lastResult && (
        <div className="calc-result">
          <h4>{lastResult.title}</h4>
          <p>{lastResult.method}</p>
          <ul>
            {(['low', 'base', 'high'] as const).map((sc) => (
              <li key={sc}>
                <strong>{sc}:</strong> {fmt(lastResult.results[sc].value, lastResult.results[sc].unit)}
                {lastResult.results[sc].unit}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};