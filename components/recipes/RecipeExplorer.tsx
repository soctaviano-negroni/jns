"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Recipe, FilterOptions } from "@/types/recipe";
import { SearchFilters, createSearchContext, searchAndFilter, emptyFilters, sortRecipes } from "@/lib/search";
import { getCustomRecipes } from "@/lib/recipes";
import { SearchBar } from "@/components/search/SearchBar";
import { FilterPanel } from "@/components/search/FilterPanel";
import { RecipeGrid } from "./RecipeGrid";

interface RecipeExplorerProps {
  initialRecipes: Recipe[];
  filterOptions: FilterOptions;
}

export function RecipeExplorer({ initialRecipes, filterOptions }: RecipeExplorerProps) {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>(initialRecipes);
  const [recipes, setRecipes] = useState<Recipe[]>(() => sortRecipes(initialRecipes, "name-asc"));
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(emptyFilters);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Load custom recipes from localStorage on mount
  useEffect(() => {
    const customRecipes = getCustomRecipes();
    if (customRecipes.length > 0) {
      const combined = [...initialRecipes, ...customRecipes];
      setAllRecipes(combined);
      setRecipes(sortRecipes(combined, filters.sortBy));
    }
  }, [initialRecipes, filters.sortBy]);

  const searchContext = useMemo(() => createSearchContext(allRecipes), [allRecipes]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Apply search and filters
  useEffect(() => {
    const results = searchAndFilter(searchContext, debouncedQuery, filters);
    setRecipes(results);
  }, [searchContext, debouncedQuery, filters]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleFilterChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          resultCount={debouncedQuery || filters.spirits.length || filters.strength || filters.difficulty ? recipes.length : undefined}
          className="max-w-md"
        />
        <FilterPanel
          filters={filters}
          options={filterOptions}
          onChange={handleFilterChange}
        />
      </div>

      <RecipeGrid recipes={recipes} />
    </div>
  );
}
