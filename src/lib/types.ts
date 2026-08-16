export type Category = "pastries" | "bread" | "cake";

export const CATEGORIES: Category[] = ["pastries", "bread", "cake"];

export const CATEGORY_LABELS: Record<Category, string> = {
  pastries: "Pastries",
  bread: "Bread",
  cake: "Cake",
};

export type Ingredient = {
  id?: string;
  section_id?: string;
  name: string;
  quantity: number;
  unit: string;
  position?: number;
};

export type IngredientSection = {
  id?: string;
  recipe_id?: string;
  name: string;
  position?: number;
  ingredients: Ingredient[];
};

export type Recipe = {
  id: string;
  category: Category;
  name: string;
  base_weight: number;
  created_at?: string;
  sections?: IngredientSection[];
};

export const UNITS = ["g", "kg", "ml", "l", "tsp", "tbsp", "cup", "can", "pcs"];

export const FRACTIONS: { label: string; value: number }[] = [
  { label: "¼", value: 0.25 },
  { label: "⅓", value: 1 / 3 },
  { label: "½", value: 0.5 },
  { label: "⅔", value: 2 / 3 },
  { label: "¾", value: 0.75 },
];

export const DEFAULT_SECTION_NAME = "Ingredients";
