import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import RecipeForm from "@/components/RecipeForm";
import type { Ingredient, Recipe } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditRecipePage({ params }: { params: { id: string } }) {
  const { data: recipe } = await supabase.from("recipes").select("*").eq("id", params.id).single();
  if (!recipe) notFound();
  const { data: ingredients } = await supabase
    .from("ingredients")
    .select("*")
    .eq("recipe_id", params.id)
    .order("name");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Recipe</h1>
      <RecipeForm
        initial={{
          ...(recipe as Recipe),
          ingredients: (ingredients ?? []) as Ingredient[],
        }}
      />
    </div>
  );
}
