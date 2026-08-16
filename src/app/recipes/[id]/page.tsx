import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { IngredientSection, Recipe } from "@/lib/types";
import RecipeScaler from "@/components/RecipeScaler";
import DeleteRecipeButton from "@/components/DeleteRecipeButton";

export const dynamic = "force-dynamic";

export default async function RecipePage({ params }: { params: { id: string } }) {
  const { data: recipe } = await supabase.from("recipes").select("*").eq("id", params.id).single();
  if (!recipe) notFound();

  const { data: sections } = await supabase
    .from("ingredient_sections")
    .select("id, name, position, ingredients(id, name, quantity, unit, position)")
    .eq("recipe_id", params.id)
    .order("position");

  const r = recipe as Recipe;
  const secs: IngredientSection[] = (sections ?? []).map((s: any) => ({
    id: s.id,
    name: s.name,
    position: s.position,
    ingredients: (s.ingredients ?? []).sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0)),
  }));

  return (
    <div>
      <Link href={`/category/${r.category}`} className="text-sm text-gray-500">← Back</Link>
      <div className="flex justify-between items-start mt-2">
        <div>
          <h1 className="text-2xl font-bold">{r.name}</h1>
          <p className="text-sm text-gray-500 capitalize">{r.category} · APF {r.base_weight} g</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/recipes/${r.id}/edit`} className="text-sm px-3 py-1.5 rounded-md border">Edit</Link>
          <DeleteRecipeButton id={r.id} category={r.category} />
        </div>
      </div>

      <div className="mt-6">
        <RecipeScaler baseWeight={r.base_weight} sections={secs} />
      </div>
    </div>
  );
}
