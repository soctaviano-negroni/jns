import Fuse, { IFuseOptions } from "fuse.js";
import { Recipe } from "@/types/recipe";
import { spiritCategories } from "./spirit-categories";

export interface SearchFilters {
  spirits: string[];
  strength: string | null;
  difficulty: string | null;
  sortBy: string;
}

export const SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "difficulty-asc", label: "Difficulty (Easy-Hard)" },
  { value: "difficulty-desc", label: "Difficulty (Hard-Easy)" },
  { value: "strength-asc", label: "Strength (Mild-Strong)" },
  { value: "strength-desc", label: "Strength (Strong-Mild)" },
] as const;

const DIFFICULTY_ORDER: Record<string, number> = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2,
};

const STRENGTH_ORDER: Record<string, number> = {
  Mild: 0,
  "Medium-Low": 1,
  Medium: 2,
  "Medium-Strong": 3,
  Strong: 4,
  "Very Strong": 5,
};

const fuseOptions: IFuseOptions<Recipe> = {
  keys: [
    { name: "name", weight: 2 },
    { name: "baseSpirit", weight: 1.5 },
    { name: "ingredients.name", weight: 1 },
    { name: "tags", weight: 0.8 },
    { name: "characteristics.flavor", weight: 0.7 },
    { name: "characteristics.style", weight: 0.5 },
  ],
  threshold: 0.3,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

export interface SearchContext {
  fuse: Fuse<Recipe>;
  recipes: Recipe[];
}

export function createSearchContext(recipes: Recipe[]): SearchContext {
  return {
    fuse: new Fuse(recipes, fuseOptions),
    recipes,
  };
}

export function searchRecipes(
  context: SearchContext,
  query: string
): Recipe[] {
  if (!query.trim()) {
    return context.recipes;
  }

  const results = context.fuse.search(query);
  return results.map((result) => result.item);
}

// Parse comma-separated baseSpirit into individual spirits
function parseBaseSpirits(baseSpirit: string): string[] {
  return baseSpirit.split(",").map((s) => s.trim());
}

// Expand a selected spirit filter to include all variants in its category
function getExpandedSpirits(selectedSpirit: string): string[] {
  return spiritCategories[selectedSpirit] || [selectedSpirit];
}

export function filterRecipes(
  recipes: Recipe[],
  filters: SearchFilters
): Recipe[] {
  return recipes.filter((recipe) => {
    // Filter by spirits (OR within spirits)
    if (filters.spirits.length > 0) {
      // Parse the recipe's baseSpirit (handles comma-separated values)
      const recipeSpirits = parseBaseSpirits(recipe.baseSpirit);

      // Expand each selected filter to include category variants
      const expandedFilterSpirits = filters.spirits.flatMap(getExpandedSpirits);

      // Check if any recipe spirit matches any expanded filter spirit
      const hasMatchingSpirit = recipeSpirits.some((recipeSpirit) =>
        expandedFilterSpirits.some(
          (filterSpirit) =>
            recipeSpirit.toLowerCase() === filterSpirit.toLowerCase()
        )
      );
      if (!hasMatchingSpirit) return false;
    }

    // Filter by strength
    if (filters.strength) {
      if (recipe.characteristics?.strength !== filters.strength) {
        return false;
      }
    }

    // Filter by difficulty
    if (filters.difficulty) {
      if (recipe.characteristics?.difficulty !== filters.difficulty) {
        return false;
      }
    }

    return true;
  });
}

export function sortRecipes(recipes: Recipe[], sortBy: string): Recipe[] {
  const sorted = [...recipes];

  switch (sortBy) {
    case "name-asc":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "difficulty-asc":
      sorted.sort(
        (a, b) =>
          (DIFFICULTY_ORDER[a.characteristics?.difficulty ?? ""] ?? 99) -
          (DIFFICULTY_ORDER[b.characteristics?.difficulty ?? ""] ?? 99)
      );
      break;
    case "difficulty-desc":
      sorted.sort(
        (a, b) =>
          (DIFFICULTY_ORDER[b.characteristics?.difficulty ?? ""] ?? 99) -
          (DIFFICULTY_ORDER[a.characteristics?.difficulty ?? ""] ?? 99)
      );
      break;
    case "strength-asc":
      sorted.sort(
        (a, b) =>
          (STRENGTH_ORDER[a.characteristics?.strength ?? ""] ?? 99) -
          (STRENGTH_ORDER[b.characteristics?.strength ?? ""] ?? 99)
      );
      break;
    case "strength-desc":
      sorted.sort(
        (a, b) =>
          (STRENGTH_ORDER[b.characteristics?.strength ?? ""] ?? 99) -
          (STRENGTH_ORDER[a.characteristics?.strength ?? ""] ?? 99)
      );
      break;
  }

  return sorted;
}

export function searchAndFilter(
  context: SearchContext,
  query: string,
  filters: SearchFilters
): Recipe[] {
  const searched = searchRecipes(context, query);
  const filtered = filterRecipes(searched, filters);
  return sortRecipes(filtered, filters.sortBy);
}

export const emptyFilters: SearchFilters = {
  spirits: [],
  strength: null,
  difficulty: null,
  sortBy: "name-asc",
};
