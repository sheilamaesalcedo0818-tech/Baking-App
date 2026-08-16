import type { Ingredient } from "./types";

export function scaleIngredients(
  ingredients: Ingredient[],
  baseWeight: number,
  targetWeight: number
): Ingredient[] {
  if (baseWeight <= 0) return ingredients;
  const ratio = targetWeight / baseWeight;
  return ingredients.map((ing) => ({
    ...ing,
    quantity: ing.quantity * ratio,
  }));
}

export function round(n: number): number {
  if (n === 0) return 0;
  if (Math.abs(n) >= 100) return Math.round(n);
  if (Math.abs(n) >= 10) return Math.round(n * 10) / 10;
  return Math.round(n * 100) / 100;
}

const WEIGHT_UNITS = new Set(["g", "kg"]);

const FRACTION_TABLE: { value: number; label: string }[] = [
  { value: 0, label: "" },
  { value: 1 / 8, label: "⅛" },
  { value: 1 / 4, label: "¼" },
  { value: 1 / 3, label: "⅓" },
  { value: 1 / 2, label: "½" },
  { value: 2 / 3, label: "⅔" },
  { value: 3 / 4, label: "¾" },
  { value: 1, label: "" },
];

export function splitQuantity(q: number): { whole: number; fraction: number } {
  if (!Number.isFinite(q) || q <= 0) return { whole: 0, fraction: 0 };
  const whole = Math.floor(q);
  const frac = q - whole;
  let best = FRACTION_TABLE[0];
  let bestDiff = Infinity;
  for (const f of FRACTION_TABLE) {
    const d = Math.abs(f.value - frac);
    if (d < bestDiff) { bestDiff = d; best = f; }
  }
  if (best.value === 1) return { whole: whole + 1, fraction: 0 };
  return { whole, fraction: best.value };
}

function nearestFraction(frac: number): { whole: number; label: string } {
  let best = FRACTION_TABLE[0];
  let bestDiff = Infinity;
  for (const f of FRACTION_TABLE) {
    const d = Math.abs(f.value - frac);
    if (d < bestDiff) { bestDiff = d; best = f; }
  }
  if (best.value === 1) return { whole: 1, label: "" };
  return { whole: 0, label: best.label };
}

export function formatQuantity(qty: number, unit: string): string {
  if (WEIGHT_UNITS.has(unit)) return String(round(qty));
  if (qty === 0) return "0";
  const sign = qty < 0 ? "-" : "";
  const abs = Math.abs(qty);
  const whole = Math.floor(abs);
  const frac = abs - whole;
  const { whole: carry, label } = nearestFraction(frac);
  const total = whole + carry;
  if (!label) return sign + String(total);
  if (total === 0) return sign + label;
  return sign + String(total) + label;
}
