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
  { label: "—", value: 0 },
  { label: "⅛", value: 1 / 8 },
  { label: "¼", value: 1 / 4 },
  { label: "⅓", value: 1 / 3 },
  { label: "½", value: 1 / 2 },
  { label: "⅔", value: 2 / 3 },
  { label: "¾", value: 3 / 4 },
];

export const DEFAULT_SECTION_NAME = "Ingredients";
