import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CATEGORIES, CATEGORY_LABELS, type Category, type Recipe } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: { category: string } }) {
  if (!CATEGORIES.includes(params.category as Category)) notFound();
  const category = params.category as Category;

  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  const recipes = (data ?? []) as Recipe[];

  return (
    <div>
      <Link href="/" className="text-sm text-gray-500">← Home</Link>
      <h1 className="text-2xl font-bold mt-2 mb-4">{CATEGORY_LABELS[category]}</h1>
      {recipes.length === 0 ? (
        <p className="text-gray-500">No recipes yet. <Link href="/recipes/new" className="underline">Add one</Link>.</p>
      ) : (
        <ul className="grid gap-2">
          {recipes.map((r) => (
            <li key={r.id}>
              <Link
                href={`/recipes/${r.id}`}
                className="flex justify-between items-center p-4 bg-white rounded-lg border hover:shadow-sm"
              >
                <span className="font-medium">{r.name}</span>
                <span className="text-sm text-gray-500">{r.base_weight} g</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
