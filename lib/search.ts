import Fuse, { IFuseOptions } from "fuse.js";
import { Recipe } from "@/types/recipe";

export interface SearchFilters {
  spirits: string[];
  strength: string | null;
  difficulty: string | null;
}

// Spirit category mappings - when filtering by a category, include all variants
export const spiritCategories: Record<string, string[]> = {
  Whiskey: ["Whiskey", "Bourbon", "Rye", "Scotch", "Rye Whiskey"],
  Tequila: ["Tequila", "Mezcal"],
};

// Reverse mapping: variant -> category (for display grouping)
export const spiritToCategory: Record<string, string> = {
  Bourbon: "Whiskey",
  Rye: "Whiskey",
  Scotch: "Whiskey",
  "Rye Whiskey": "Whiskey",
  Mezcal: "Tequila",
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

export function searchAndFilter(
  context: SearchContext,
  query: string,
  filters: SearchFilters
): Recipe[] {
  const searched = searchRecipes(context, query);
  return filterRecipes(searched, filters);
}

export const emptyFilters: SearchFilters = {
  spirits: [],
  strength: null,
  difficulty: null,
};
