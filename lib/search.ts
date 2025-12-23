import Fuse, { IFuseOptions } from "fuse.js";
import { Recipe } from "@/types/recipe";

export interface SearchFilters {
  spirits: string[];
  strength: string | null;
  difficulty: string | null;
}

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

export function filterRecipes(
  recipes: Recipe[],
  filters: SearchFilters
): Recipe[] {
  return recipes.filter((recipe) => {
    // Filter by spirits (OR within spirits)
    if (filters.spirits.length > 0) {
      const hasMatchingSpirit = filters.spirits.some((spirit) =>
        recipe.baseSpirit.toLowerCase().includes(spirit.toLowerCase())
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
