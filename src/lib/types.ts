export type Category = "pastries" | "bread" | "cake";

export const CATEGORIES: Category[] = ["pastries", "bread", "cake"];

export const CATEGORY_LABELS: Record<Category, string> = {
  pastries: "Pastries",
  bread: "Bread",
  cake: "Cake",
};

export type Ingredient = {
  id?: string;
  recipe_id?: string;
  name: string;
  quantity: number;
  unit: string;
};

export type Recipe = {
  id: string;
  category: Category;
  name: string;
  base_weight: number;
  created_at?: string;
  ingredients?: Ingredient[];
};

export const UNITS = ["g", "kg", "ml", "l", "tsp", "tbsp", "cup", "pcs"];
