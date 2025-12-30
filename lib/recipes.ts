import { Recipe, FilterOptions } from "@/types/recipe";
import recipesData from "@/data/recipes.json";
import { spiritToCategory } from "./spirit-categories";

const STORAGE_KEY = "custom-recipes";

export function getBaseRecipes(): Recipe[] {
  return recipesData as Recipe[];
}

export function getCustomRecipes(): Recipe[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Recipe[];
  } catch {
    return [];
  }
}

export function getAllRecipes(): Recipe[] {
  const base = getBaseRecipes();
  const custom = getCustomRecipes();
  return [...base, ...custom];
}

export function getRecipeById(id: string): Recipe | undefined {
  const allRecipes = getAllRecipes();
  return allRecipes.find((recipe) => recipe.id === id);
}

export function addRecipe(recipe: Recipe): void {
  if (typeof window === "undefined") return;

  const custom = getCustomRecipes();
  custom.push(recipe);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
}

export function deleteRecipe(id: string): boolean {
  if (typeof window === "undefined") return false;

  const custom = getCustomRecipes();
  const filtered = custom.filter((recipe) => recipe.id !== id);

  if (filtered.length === custom.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function isCustomRecipe(id: string): boolean {
  const custom = getCustomRecipes();
  return custom.some((recipe) => recipe.id === id);
}

export function getFilterOptions(): FilterOptions {
  const recipes = getAllRecipes();

  const spirits = new Set<string>();
  const strengths = new Set<string>();
  const difficulties = new Set<string>();
  const flavors = new Set<string>();

  recipes.forEach((recipe) => {
    if (recipe.baseSpirit) {
      // Parse comma-separated base spirits
      const individualSpirits = recipe.baseSpirit.split(",").map((s) => s.trim());
      individualSpirits.forEach((spirit) => {
        // Map variant spirits to their category (e.g., Bourbon -> Whiskey)
        const category = spiritToCategory[spirit] || spirit;
        spirits.add(category);
      });
    }
    if (recipe.characteristics?.strength) {
      strengths.add(recipe.characteristics.strength);
    }
    if (recipe.characteristics?.difficulty) {
      difficulties.add(recipe.characteristics.difficulty);
    }
    recipe.characteristics?.flavor?.forEach((f) => flavors.add(f));
  });

  return {
    spirits: Array.from(spirits).sort(),
    strengths: ["Mild", "Medium-Low", "Medium", "Medium-Strong", "Strong", "Very Strong"].filter(s => strengths.has(s)),
    difficulties: ["Beginner", "Intermediate", "Advanced"].filter(d => difficulties.has(d)),
    flavors: Array.from(flavors).sort(),
  };
}

export function generateId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function validateRecipe(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Invalid JSON structure"] };
  }

  const recipe = data as Record<string, unknown>;

  if (!recipe.name || typeof recipe.name !== "string") {
    errors.push("Missing or invalid 'name' field");
  }

  if (!recipe.baseSpirit || typeof recipe.baseSpirit !== "string") {
    errors.push("Missing or invalid 'baseSpirit' field");
  }

  if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
    errors.push("Missing or invalid 'ingredients' array");
  }

  if (!recipe.preparation || typeof recipe.preparation !== "object") {
    errors.push("Missing or invalid 'preparation' object");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
