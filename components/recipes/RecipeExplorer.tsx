"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Recipe, FilterOptions } from "@/types/recipe";
import { SearchFilters, createSearchContext, searchAndFilter, emptyFilters, sortRecipes } from "@/lib/search";
import { getCustomRecipes } from "@/lib/recipes";
import { SearchBar } from "@/components/search/SearchBar";
import { FilterPanel } from "@/components/search/FilterPanel";
import { RecipeGrid } from "./RecipeGrid";

const STORAGE_KEY = "recipe-explorer-state";

interface SavedState {
  filters: SearchFilters;
  searchQuery: string;
  scrollY: number;
}

function saveState(state: SavedState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function loadState(): SavedState | null {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

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
  const isRestoringState = useRef(false);
  const hasRestoredState = useRef(false);

  // Restore state from sessionStorage on mount
  useEffect(() => {
    if (hasRestoredState.current) return;
    hasRestoredState.current = true;

    const saved = loadState();
    if (saved) {
      isRestoringState.current = true;
      setFilters(saved.filters);
      setSearchQuery(saved.searchQuery);
      setDebouncedQuery(saved.searchQuery);

      // Restore scroll position after recipes render
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, saved.scrollY);
          isRestoringState.current = false;
        });
      });
    }
  }, []);

  // Save scroll position before navigating away
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveState({
        filters,
        searchQuery,
        scrollY: window.scrollY,
      });
    };

    // Save on any click (captures navigation)
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a")) {
        saveState({
          filters,
          searchQuery,
          scrollY: window.scrollY,
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleClick, true);
    };
  }, [filters, searchQuery]);

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
