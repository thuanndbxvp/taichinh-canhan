/**
 * Finance Calculator — tính toán chuẩn để AI diễn giải.
 *
 * Nguyên tắc Phase 4.4 (plan1.md):
 *   - AI KHÔNG tự tính. Calculator tạo kết quả chuẩn có đơn vị + assumption.
 *   - Kết quả được bind vào scene qua calculationId.
 *   - Scenario: thấp / cơ sở / cao.
 *
 * Module này pure-function, không phụ thuộc React/DOM. Dùng cho cả
 * runtime UI và test.
 */
export const CALCULATION_SCHEMA_VERSION = 1;

export type CalcKind =
  | 'compound-interest'
  | 'simple-interest'
  | 'monthly-savings'
  | 'inflation-adjust'
  | 'opportunity-cost'
  | 'fee-impact';

export type Scenario = 'low' | 'base' | 'high';

export interface CalcAssumption {
  /**
   * Tên assumption (vd: 'lãi suất hàng năm', 'thời gian (năm)').
   */
  name: string;
  value: number;
  unit: string;
}

export interface CalcResult {
  value: number;
  unit: string;
  /**
   * Label ngắn (vd: 'Tổng sau 10 năm').
   */
  label: string;
}

export interface Calculation {
  schemaVersion: number;
  id: string;
  kind: CalcKind;
  title: string;
  assumptions: CalcAssumption[];
  /**
   * Kết quả theo từng scenario.
   */
  results: Record<Scenario, CalcResult>;
  /**
   * Ghi chú phương pháp (công thức + bước).
   */
  method: string;
  createdAt: number;
}

/**
 * Sinh id ổn định cho calculation.
 */
export function newCalculationId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `calc-${crypto.randomUUID()}`;
  }
  return `calc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Lãi kép: A = P * (1 + r/n)^(n*t).
 * P = principal, r = rate (decimal), t = years, n = compoundFreq/năm.
 */
export function compoundInterest(
  principal: number,
  annualRate: number,
  years: number,
  compoundFreq: number = 12,
): number {
  if (principal <= 0 || years <= 0) return principal;
  const r = annualRate / 100;
  return principal * Math.pow(1 + r / compoundFreq, compoundFreq * years);
}

/**
 * Lãi đơn: A = P * (1 + r*t).
 */
export function simpleInterest(
  principal: number,
  annualRate: number,
  years: number,
): number {
  if (principal <= 0 || years <= 0) return principal;
  const r = annualRate / 100;
  return principal * (1 + r * years);
}

/**
 * Tiết kiệm hàng tháng với lãi kép: FV = PMT * (((1+r)^n - 1) / r).
 * PMT monthly, r monthly rate, n = months.
 */
export function monthlySavingsFutureValue(
  monthlyAmount: number,
  annualRate: number,
  months: number,
): number {
  if (monthlyAmount <= 0 || months <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return monthlyAmount * months;
  return monthlyAmount * ((Math.pow(1 + r, months) - 1) / r);
}

/**
 * Điều chỉnh lạm phát: giá trị thực = nominal / (1 + inflation)^years.
 */
export function inflationAdjusted(
  nominalValue: number,
  annualInflation: number,
  years: number,
): number {
  if (years <= 0) return nominalValue;
  return nominalValue / Math.pow(1 + annualInflation / 100, years);
}

/**
 * Chi phí cơ hội: nếu dùng X để invest vs giữ tiền mặt.
 * Trả về chênh lệch giữa 2 kịch bản sau `years`.
 */
export function opportunityCost(
  cashAmount: number,
  alternativeReturnRate: number,
  years: number,
): { finalIfInvested: number; finalIfCash: number; delta: number } {
  const finalIfInvested = compoundInterest(cashAmount, alternativeReturnRate, years);
  const finalIfCash = cashAmount; // giả sử giữ tiền mặt không tăng
  return { finalIfInvested, finalIfCash, delta: finalIfInvested - finalIfCash };
}

/**
 * Tác động của phí ẩn lên lợi nhuận: tính effective annual return sau khi trừ
 * phí hàng năm (vd: phí quản lý quỹ 1.5%/năm).
 */
export function feeImpact(
  grossReturnRate: number,
  annualFeePercent: number,
): { netReturnRate: number; lostToFees: number } {
  const netReturnRate = grossReturnRate - annualFeePercent;
  return { netReturnRate, lostToFees: annualFeePercent };
}

/**
 * Tạo Calculation đầy đủ với 3 scenario (low/base/high).
 * Mỗi loại calc định nghĩa cách derive 3 scenario.
 */
export function buildCalculation(
  kind: CalcKind,
  title: string,
  inputs: {
    principal?: number;
    monthly?: number;
    annualRate: number;
    years: number;
    compoundFreq?: number;
    inflation?: number;
    fee?: number;
  },
): Calculation {
  const id = newCalculationId();
  const { principal = 0, monthly = 0, annualRate, years, compoundFreq = 12, inflation = 0, fee = 0 } = inputs;
  const scenarios: Record<Scenario, CalcResult> = {
    low: { value: 0, unit: 'VND', label: 'Scenario thấp' },
    base: { value: 0, unit: 'VND', label: 'Scenario cơ sở' },
    high: { value: 0, unit: 'VND', label: 'Scenario cao' },
  };
  let method = '';
  switch (kind) {
    case 'compound-interest': {
      const low = compoundInterest(principal, annualRate - 1, years, compoundFreq);
      const base = compoundInterest(principal, annualRate, years, compoundFreq);
      const high = compoundInterest(principal, annualRate + 1, years, compoundFreq);
      scenarios.low = { value: roundVnd(low), unit: 'VND', label: 'Scenario thấp' };
      scenarios.base = { value: roundVnd(base), unit: 'VND', label: 'Scenario cơ sở' };
      scenarios.high = { value: roundVnd(high), unit: 'VND', label: 'Scenario cao' };
      method = `A = P × (1 + r/n)^(n·t) với P=${principal}, r=${annualRate}%±1%, t=${years}năm, n=${compoundFreq}.`;
      break;
    }
    case 'simple-interest': {
      const low = simpleInterest(principal, annualRate - 1, years);
      const base = simpleInterest(principal, annualRate, years);
      const high = simpleInterest(principal, annualRate + 1, years);
      scenarios.low = { value: roundVnd(low), unit: 'VND', label: 'Scenario thấp' };
      scenarios.base = { value: roundVnd(base), unit: 'VND', label: 'Scenario cơ sở' };
      scenarios.high = { value: roundVnd(high), unit: 'VND', label: 'Scenario cao' };
      method = `A = P × (1 + r·t) với P=${principal}, r=${annualRate}%±1%, t=${years}.`;
      break;
    }
    case 'monthly-savings': {
      const low = monthlySavingsFutureValue(monthly, annualRate - 1, years * 12);
      const base = monthlySavingsFutureValue(monthly, annualRate, years * 12);
      const high = monthlySavingsFutureValue(monthly, annualRate + 1, years * 12);
      scenarios.low = { value: roundVnd(low), unit: 'VND', label: 'Scenario thấp' };
      scenarios.base = { value: roundVnd(base), unit: 'VND', label: 'Scenario cơ sở' };
      scenarios.high = { value: roundVnd(high), unit: 'VND', label: 'Scenario cao' };
      method = `FV = PMT × (((1+r)^n - 1) / r) với PMT=${monthly}/tháng, r=${annualRate}%±1%/năm, n=${years * 12}.`;
      break;
    }
    case 'inflation-adjust': {
      const low = inflationAdjusted(principal, inflation + 0.5, years);
      const base = inflationAdjusted(principal, inflation, years);
      const high = inflationAdjusted(principal, inflation - 0.5, years);
      scenarios.low = { value: roundVnd(low), unit: 'VND', label: 'Scenario thấp (lạm phát cao hơn)' };
      scenarios.base = { value: roundVnd(base), unit: 'VND', label: 'Scenario cơ sở' };
      scenarios.high = { value: roundVnd(high), unit: 'VND', label: 'Scenario cao (lạm phát thấp hơn)' };
      method = `Real = Nominal / (1 + i)^t với Nominal=${principal}, i=${inflation}%±0.5%, t=${years}.`;
      break;
    }
    case 'opportunity-cost': {
      const low = opportunityCost(principal, annualRate - 1, years);
      const base = opportunityCost(principal, annualRate, years);
      const high = opportunityCost(principal, annualRate + 1, years);
      scenarios.low = { value: roundVnd(low.delta), unit: 'VND', label: 'Chênh lệch thấp' };
      scenarios.base = { value: roundVnd(base.delta), unit: 'VND', label: 'Chênh lệch cơ sở' };
      scenarios.high = { value: roundVnd(high.delta), unit: 'VND', label: 'Chênh lệch cao' };
      method = `Delta = Invest(${annualRate}%±1%) − Cash(${principal}), t=${years}.`;
      break;
    }
    case 'fee-impact': {
      const low = feeImpact(annualRate, fee - 0.1);
      const base = feeImpact(annualRate, fee);
      const high = feeImpact(annualRate, fee + 0.1);
      scenarios.low = { value: roundPercent(low.netReturnRate), unit: '%', label: 'Net return thấp (phí thấp)' };
      scenarios.base = { value: roundPercent(base.netReturnRate), unit: '%', label: 'Net return cơ sở' };
      scenarios.high = { value: roundPercent(high.netReturnRate), unit: '%', label: 'Net return cao (phí cao)' };
      method = `Net = Gross − Fee, Gross=${annualRate}%, Fee=${fee}%±0.1%.`;
      break;
    }
  }
  return {
    schemaVersion: CALCULATION_SCHEMA_VERSION,
    id,
    kind,
    title,
    assumptions: [
      { name: 'principal', value: principal, unit: 'VND' },
      { name: 'monthly', value: monthly, unit: 'VND' },
      { name: 'annualRate', value: annualRate, unit: '%' },
      { name: 'years', value: years, unit: 'năm' },
      { name: 'inflation', value: inflation, unit: '%' },
      { name: 'fee', value: fee, unit: '%' },
    ],
    results: scenarios,
    method,
    createdAt: Date.now(),
  };
}

function roundVnd(v: number): number {
  return Math.round(v);
}

function roundPercent(v: number): number {
  return Math.round(v * 100) / 100;
}

/**
 * Format Calculation thành text để nhúng vào narration.
 */
export function renderCalculationNarration(c: Calculation): string {
  const base = c.results.base;
  const unit = base.unit === '%' ? '%' : 'VND';
  const fmt = (v: number) =>
    unit === '%'
      ? `${v}%`
      : new Intl.NumberFormat('vi-VN').format(v);
  return [
    `**${c.title}** (${c.method})`,
    `- Thấp: ${fmt(c.results.low.value)}${unit}`,
    `- Cơ sở: ${fmt(c.results.base.value)}${unit}`,
    `- Cao: ${fmt(c.results.high.value)}${unit}`,
  ].join('\n');
}