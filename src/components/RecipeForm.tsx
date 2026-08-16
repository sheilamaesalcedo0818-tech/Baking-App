"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  UNITS,
  type Category,
  type Ingredient,
  type Recipe,
} from "@/lib/types";

type Props = { initial?: Recipe };

export default function RecipeForm({ initial }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState<Category>(initial?.category ?? "bread");
  const [baseWeight, setBaseWeight] = useState<number>(initial?.base_weight ?? 1000);
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initial?.ingredients?.length
      ? initial.ingredients
      : [{ name: "", quantity: 0, unit: "g" }]
  );
  const [busy, setBusy] = useState(false);

  function updateIng(i: number, patch: Partial<Ingredient>) {
    setIngredients((arr) => arr.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  }
  function addIng() {
    setIngredients((arr) => [...arr, { name: "", quantity: 0, unit: "g" }]);
  }
  function removeIng(i: number) {
    setIngredients((arr) => arr.filter((_, idx) => idx !== i));
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
      await supabase.from("ingredients").delete().eq("recipe_id", initial.id);
    } else {
      const { data, error } = await supabase
        .from("recipes")
        .insert({ name, category, base_weight: baseWeight })
        .select("id")
        .single();
      if (error || !data) { setBusy(false); return alert(error?.message ?? "Insert failed"); }
      recipeId = data.id;
    }

    const rows = ingredients
      .filter((i) => i.name.trim())
      .map((i) => ({
        recipe_id: recipeId!,
        name: i.name.trim(),
        quantity: Number(i.quantity) || 0,
        unit: i.unit,
      }));
    if (rows.length) {
      const { error } = await supabase.from("ingredients").insert(rows);
      if (error) { setBusy(false); return alert(error.message); }
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
          <label className="block text-sm font-medium mb-1">Base weight (g)</label>
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

      <div className="p-4 bg-white border rounded-lg space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">Ingredients</h2>
          <button type="button" onClick={addIng} className="text-sm px-3 py-1.5 rounded-md border">
            + Add
          </button>
        </div>
        {ingredients.map((ing, i) => (
          <div key={i} className="grid grid-cols-[1fr_5rem_5rem_auto] gap-2 items-center">
            <input
              placeholder="Ingredient"
              value={ing.name}
              onChange={(e) => updateIng(i, { name: e.target.value })}
              className="px-2 py-2 border rounded-md"
            />
            <input
              type="number"
              inputMode="decimal"
              min={0}
              value={ing.quantity}
              onChange={(e) => updateIng(i, { quantity: parseFloat(e.target.value) || 0 })}
              className="px-2 py-2 border rounded-md text-right"
            />
            <select
              value={ing.unit}
              onChange={(e) => updateIng(i, { unit: e.target.value })}
              className="px-1 py-2 border rounded-md bg-white"
            >
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
            <button
              type="button"
              onClick={() => removeIng(i)}
              className="px-2 py-2 text-red-600"
              aria-label="Remove"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

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
