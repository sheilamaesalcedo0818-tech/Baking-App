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
    quantity: round(ing.quantity * ratio),
  }));
}

export function round(n: number): number {
  if (n === 0) return 0;
  if (Math.abs(n) >= 100) return Math.round(n);
  if (Math.abs(n) >= 10) return Math.round(n * 10) / 10;
  return Math.round(n * 100) / 100;
}
