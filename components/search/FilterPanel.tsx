"use client";

import { ChevronDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FilterOptions } from "@/types/recipe";
import { SearchFilters, SORT_OPTIONS } from "@/lib/search";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FilterPanelProps {
  filters: SearchFilters;
  options: FilterOptions;
  onChange: (filters: SearchFilters) => void;
}

export function FilterPanel({ filters, options, onChange }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters =
    filters.spirits.length > 0 || filters.strength || filters.difficulty;

  const clearFilters = () => {
    onChange({
      spirits: [],
      strength: null,
      difficulty: null,
      sortBy: "name-asc",
    });
  };

  const setSort = (sortBy: string) => {
    onChange({ ...filters, sortBy });
  };

  const toggleSpirit = (spirit: string) => {
    const newSpirits = filters.spirits.includes(spirit)
      ? filters.spirits.filter((s) => s !== spirit)
      : [...filters.spirits, spirit];
    onChange({ ...filters, spirits: newSpirits });
  };

  const setStrength = (strength: string | null) => {
    onChange({ ...filters, strength: filters.strength === strength ? null : strength });
  };

  const setDifficulty = (difficulty: string | null) => {
    onChange({ ...filters, difficulty: filters.difficulty === difficulty ? null : difficulty });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-amber"
        >
          <span>Filters & Sorting</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 bg-amber/10 text-amber-dark">
              {filters.spirits.length + (filters.strength ? 1 : 0) + (filters.difficulty ? 1 : 0)}
            </Badge>
          )}
        </button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 text-muted-foreground hover:text-foreground"
          >
            Clear all
            <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-medium text-foreground">Spirit</h4>
            <div className="flex flex-wrap gap-2">
              {options.spirits.map((spirit) => (
                <Badge
                  key={spirit}
                  variant={filters.spirits.includes(spirit) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-colors duration-200",
                    filters.spirits.includes(spirit)
                      ? "bg-amber text-charcoal hover:bg-amber/90"
                      : "hover:bg-secondary"
                  )}
                  onClick={() => toggleSpirit(spirit)}
                >
                  {spirit}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="mb-2 text-sm font-medium text-foreground">Strength</h4>
            <div className="flex flex-wrap gap-2">
              {options.strengths.map((strength) => (
                <Badge
                  key={strength}
                  variant={filters.strength === strength ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-colors duration-200",
                    filters.strength === strength
                      ? "bg-amber text-charcoal hover:bg-amber/90"
                      : "hover:bg-secondary"
                  )}
                  onClick={() => setStrength(strength)}
                >
                  {strength}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="mb-2 text-sm font-medium text-foreground">Difficulty</h4>
            <div className="flex flex-wrap gap-2">
              {options.difficulties.map((difficulty) => (
                <Badge
                  key={difficulty}
                  variant={filters.difficulty === difficulty ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-colors duration-200",
                    filters.difficulty === difficulty
                      ? "bg-amber text-charcoal hover:bg-amber/90"
                      : "hover:bg-secondary"
                  )}
                  onClick={() => setDifficulty(difficulty)}
                >
                  {difficulty}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="mb-2 text-sm font-medium text-foreground">Sort By</h4>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((option) => (
                <Badge
                  key={option.value}
                  variant={filters.sortBy === option.value ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-colors duration-200",
                    filters.sortBy === option.value
                      ? "bg-amber text-charcoal hover:bg-amber/90"
                      : "hover:bg-secondary"
                  )}
                  onClick={() => setSort(option.value)}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
