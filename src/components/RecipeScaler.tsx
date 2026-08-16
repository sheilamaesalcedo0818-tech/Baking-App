"use client";

import { useMemo, useState } from "react";
import type { IngredientSection } from "@/lib/types";
import { formatQuantity, scaleIngredients } from "@/lib/scale";

const PRESETS: { label: string; factor: number }[] = [
  { label: "½", factor: 0.5 },
  { label: "1×", factor: 1 },
  { label: "1½", factor: 1.5 },
  { label: "2×", factor: 2 },
  { label: "3×", factor: 3 },
];

export default function RecipeScaler({
  baseWeight,
  sections,
}: {
  baseWeight: number;
  sections: IngredientSection[];
}) {
  const [target, setTarget] = useState<number>(baseWeight);

  const scaledSections = useMemo(
    () =>
      sections.map((s) => ({
        ...s,
        ingredients: scaleIngredients(s.ingredients, baseWeight, target),
      })),
    [sections, baseWeight, target]
  );

  const ratio = baseWeight > 0 ? target / baseWeight : 1;

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white border rounded-lg">
        <label className="block text-sm font-medium mb-2">Target APF (g)</label>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          value={Number.isFinite(target) ? target : 0}
          onChange={(e) => setTarget(parseFloat(e.target.value) || 0)}
          className="w-full text-lg px-3 py-2 border rounded-md"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setTarget(baseWeight * p.factor)}
              className="px-3 py-1.5 text-sm rounded-md border bg-gray-50 hover:bg-gray-100"
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Scaling ratio: <span className="font-mono">{ratio.toFixed(3)}×</span>
        </p>
      </div>

      {sections.length === 0 ? (
        <div className="p-4 bg-white border rounded-lg text-gray-500 text-sm">
          No ingredients.
        </div>
      ) : (
        sections.map((section, sIdx) => (
          <div key={section.id ?? sIdx} className="bg-white border rounded-lg overflow-hidden">
            <div className="px-4 py-2 border-b bg-gray-50">
              <h3 className="font-semibold">{section.name}</h3>
            </div>
            <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-4 py-2 text-xs uppercase tracking-wide text-gray-500 border-b">
              <div>Ingredient</div>
              <div className="text-right">Original</div>
              <div className="text-right">Scaled</div>
            </div>
            {section.ingredients.length === 0 ? (
              <div className="p-4 text-gray-500 text-sm">No ingredients in this section.</div>
            ) : (
              section.ingredients.map((ing, i) => (
                <div
                  key={ing.id ?? i}
                  className="grid grid-cols-[1fr_auto_auto] gap-3 px-4 py-3 border-b last:border-b-0 items-center"
                >
                  <div className="font-medium">{ing.name}</div>
                  <div className="text-right text-sm text-gray-500 tabular-nums">
                    {formatQuantity(ing.quantity, ing.unit)} {ing.unit}
                  </div>
                  <div className="text-right font-mono tabular-nums">
                    {formatQuantity(scaledSections[sIdx].ingredients[i].quantity, ing.unit)} {ing.unit}
                  </div>
                </div>
              ))
            )}
          </div>
        ))
      )}
    </div>
  );
}
