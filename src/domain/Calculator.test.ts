import { describe, it, expect } from 'vitest';
import {
  compoundInterest,
  simpleInterest,
  monthlySavingsFutureValue,
  inflationAdjusted,
  opportunityCost,
  feeImpact,
  buildCalculation,
  renderCalculationNarration,
} from './Calculator';

describe('compoundInterest', () => {
  it('100 triệu, 8%/năm, 10 năm ~ 222 triệu', () => {
    const result = compoundInterest(100_000_000, 8, 10);
    expect(result).toBeGreaterThan(210_000_000);
    expect(result).toBeLessThan(230_000_000);
  });

  it('rate 0% → trả về principal', () => {
    expect(compoundInterest(1000, 0, 10)).toBe(1000);
  });

  it('years 0 → trả về principal', () => {
    expect(compoundInterest(1000, 8, 0)).toBe(1000);
  });
});

describe('simpleInterest', () => {
  it('100 triệu, 8%/năm, 5 năm → 140 triệu', () => {
    expect(simpleInterest(100_000_000, 8, 5)).toBe(140_000_000);
  });
});

describe('monthlySavingsFutureValue', () => {
  it('500k/tháng, 8%/năm, 10 năm ~ 92 triệu', () => {
    const result = monthlySavingsFutureValue(500_000, 8, 120);
    expect(result).toBeGreaterThan(85_000_000);
    expect(result).toBeLessThan(100_000_000);
  });
});

describe('inflationAdjusted', () => {
  it('giảm giá trị theo lạm phát', () => {
    const adjusted = inflationAdjusted(100_000_000, 4, 10);
    expect(adjusted).toBeLessThan(100_000_000);
    expect(adjusted).toBeGreaterThan(60_000_000);
  });
});

describe('opportunityCost', () => {
  it('chênh lệch giữa invest và cash > 0', () => {
    const oc = opportunityCost(100_000_000, 8, 10);
    expect(oc.delta).toBeGreaterThan(0);
    expect(oc.finalIfInvested).toBe(oc.finalIfCash + oc.delta);
  });
});

describe('feeImpact', () => {
  it('net return = gross - fee', () => {
    const fi = feeImpact(10, 1.5);
    expect(fi.netReturnRate).toBe(8.5);
    expect(fi.lostToFees).toBe(1.5);
  });
});

describe('buildCalculation', () => {
  it('compound-interest tạo 3 scenario', () => {
    const calc = buildCalculation('compound-interest', 'Lãi kép test', {
      principal: 100_000_000,
      annualRate: 8,
      years: 10,
    });
    expect(calc.id).toBeTruthy();
    expect(calc.kind).toBe('compound-interest');
    expect(calc.results.low.value).toBeLessThan(calc.results.base.value);
    expect(calc.results.high.value).toBeGreaterThan(calc.results.base.value);
  });

  it('fee-impact trả về %', () => {
    const calc = buildCalculation('fee-impact', 'Phí', {
      principal: 0,
      annualRate: 10,
      years: 1,
      fee: 1.5,
    });
    expect(calc.results.base.unit).toBe('%');
  });
});

describe('renderCalculationNarration', () => {
  it('format tiền VND có dấu phẩy', () => {
    const calc = buildCalculation('compound-interest', 'Test', {
      principal: 100_000_000,
      annualRate: 8,
      years: 10,
    });
    const text = renderCalculationNarration(calc);
    expect(text).toContain('**Test**');
    expect(text).toMatch(/\d{1,3}(\.\d{3})+/);
  });
});