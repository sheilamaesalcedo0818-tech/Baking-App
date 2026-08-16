"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  DEFAULT_SECTION_NAME,
  UNITS,
  type Category,
  type Ingredient,
  type IngredientSection,
  type Recipe,
} from "@/lib/types";

type Props = { initial?: Recipe };

function emptyIngredient(): Ingredient {
  return { name: "", quantity: 0, unit: "g" };
}
function emptySection(name = DEFAULT_SECTION_NAME): IngredientSection {
  return { name, ingredients: [emptyIngredient()] };
}

export default function RecipeForm({ initial }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState<Category>(initial?.category ?? "bread");
  const [baseWeight, setBaseWeight] = useState<number>(initial?.base_weight ?? 1000);
  const [sections, setSections] = useState<IngredientSection[]>(
    initial?.sections?.length ? initial.sections : [emptySection()]
  );
  const [busy, setBusy] = useState(false);

  function updateSection(si: number, patch: Partial<IngredientSection>) {
    setSections((arr) => arr.map((s, i) => (i === si ? { ...s, ...patch } : s)));
  }
  function addSection() {
    setSections((arr) => [...arr, emptySection("")]);
  }
  function removeSection(si: number) {
    setSections((arr) => arr.filter((_, i) => i !== si));
  }
  function updateIng(si: number, ii: number, patch: Partial<Ingredient>) {
    setSections((arr) =>
      arr.map((s, i) =>
        i === si
          ? { ...s, ingredients: s.ingredients.map((x, j) => (j === ii ? { ...x, ...patch } : x)) }
          : s
      )
    );
  }
  function addIng(si: number) {
    setSections((arr) =>
      arr.map((s, i) => (i === si ? { ...s, ingredients: [...s.ingredients, emptyIngredient()] } : s))
    );
  }
  function removeIng(si: number, ii: number) {
    setSections((arr) =>
      arr.map((s, i) =>
        i === si ? { ...s, ingredients: s.ingredients.filter((_, j) => j !== ii) } : s
      )
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || baseWeight <= 0) return alert("Name and base weight required.");
    setBusy(true);

    let recipeId = initial?.id;
    if (initial) {
      const { error } = await supabase
        .from("recipes")
        .update({ name, category, base_weight: baseWeight })
        .eq("id", initial.id);
      if (error) { setBusy(false); return alert(error.message); }
      // Cascade deletes ingredients via section FK.
      await supabase.from("ingredient_sections").delete().eq("recipe_id", initial.id);
    } else {
      const { data, error } = await supabase
        .from("recipes")
        .insert({ name, category, base_weight: baseWeight })
        .select("id")
        .single();
      if (error || !data) { setBusy(false); return alert(error?.message ?? "Insert failed"); }
      recipeId = data.id;
    }

    for (let si = 0; si < sections.length; si++) {
      const s = sections[si];
      const sectionName = s.name.trim() || DEFAULT_SECTION_NAME;
      const { data: sData, error: sErr } = await supabase
        .from("ingredient_sections")
        .insert({ recipe_id: recipeId!, name: sectionName, position: si })
        .select("id")
        .single();
      if (sErr || !sData) { setBusy(false); return alert(sErr?.message ?? "Section insert failed"); }

      const rows = s.ingredients
        .filter((i) => i.name.trim())
        .map((i, idx) => ({
          section_id: sData.id,
          name: i.name.trim(),
          quantity: Number(i.quantity) || 0,
          unit: i.unit,
          position: idx,
        }));
      if (rows.length) {
        const { error } = await supabase.from("ingredients").insert(rows);
        if (error) { setBusy(false); return alert(error.message); }
      }
    }

    setBusy(false);
    router.push(`/recipes/${recipeId}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="p-4 bg-white border rounded-lg space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full px-3 py-2 border rounded-md bg-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">APF (g)</label>
          <input
            type="number"
            inputMode="decimal"
            min={1}
            value={baseWeight}
            onChange={(e) => setBaseWeight(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
      </div>

      {sections.map((section, si) => (
        <div key={si} className="p-4 bg-white border rounded-lg space-y-3">
          <div className="flex gap-2 items-center">
            <input
              placeholder="Section name (e.g. Crust, Filling)"
              value={section.name}
              onChange={(e) => updateSection(si, { name: e.target.value })}
              className="flex-1 px-2 py-2 border rounded-md font-semibold"
            />
            {sections.length > 1 && (
              <button
                type="button"
                onClick={() => removeSection(si)}
                className="px-2 py-2 text-red-600 border border-red-300 rounded-md text-sm"
              >
                Remove section
              </button>
            )}
          </div>

          {section.ingredients.map((ing, ii) => (
            <div key={ii} className="grid grid-cols-[1fr_5rem_5rem_auto] gap-2 items-center">
              <input
                placeholder="Ingredient"
                value={ing.name}
                onChange={(e) => updateIng(si, ii, { name: e.target.value })}
                className="px-2 py-2 border rounded-md"
              />
              <input
                type="number"
                inputMode="decimal"
                min={0}
                value={ing.quantity}
                onChange={(e) => updateIng(si, ii, { quantity: parseFloat(e.target.value) || 0 })}
                className="px-2 py-2 border rounded-md text-right"
              />
              <select
                value={ing.unit}
                onChange={(e) => updateIng(si, ii, { unit: e.target.value })}
                className="px-1 py-2 border rounded-md bg-white"
              >
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
              <button
                type="button"
                onClick={() => removeIng(si, ii)}
                className="px-2 py-2 text-red-600"
                aria-label="Remove"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addIng(si)}
            className="text-sm px-3 py-1.5 rounded-md border"
          >
            + Add ingredient
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addSection}
        className="w-full py-2 rounded-md border border-dashed text-sm"
      >
        + Add section
      </button>

      <button
        type="submit"
        disabled={busy}
        className="w-full py-3 rounded-md bg-black text-white font-medium disabled:opacity-50"
      >
        {busy ? "Saving..." : initial ? "Save changes" : "Create recipe"}
      </button>
    </form>
  );
}
