import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import RecipeForm from "@/components/RecipeForm";
import type { IngredientSection, Recipe } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditRecipePage({ params }: { params: { id: string } }) {
  const { data: recipe } = await supabase.from("recipes").select("*").eq("id", params.id).single();
  if (!recipe) notFound();

  const { data: sections } = await supabase
    .from("ingredient_sections")
    .select("id, name, position, ingredients(id, name, quantity, unit, position)")
    .eq("recipe_id", params.id)
    .order("position");

  const secs: IngredientSection[] = (sections ?? []).map((s: any) => ({
    id: s.id,
    name: s.name,
    position: s.position,
    ingredients: (s.ingredients ?? []).sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0)),
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Recipe</h1>
      <RecipeForm initial={{ ...(recipe as Recipe), sections: secs }} />
    </div>
  );
}
