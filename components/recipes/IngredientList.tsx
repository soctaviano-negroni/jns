"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ingredient } from "@/types/recipe";
import { cn } from "@/lib/utils";

interface IngredientListProps {
  ingredients: Ingredient[];
}

const SCALES = [0.5, 1, 2, 3] as const;

function formatAmount(amount: number, scale: number): string {
  const scaled = amount * scale;

  // Handle common fractions
  if (scaled === 0.25) return "1/4";
  if (scaled === 0.5) return "1/2";
  if (scaled === 0.75) return "3/4";
  if (scaled === 1.5) return "1 1/2";
  if (scaled === 2.5) return "2 1/2";

  // For whole numbers, return without decimals
  if (Number.isInteger(scaled)) return scaled.toString();

  // For decimals, round to 2 places and remove trailing zeros
  return scaled.toFixed(2).replace(/\.?0+$/, "");
}

export function IngredientList({ ingredients }: IngredientListProps) {
  const [scale, setScale] = useState(1);

  const mainIngredients = ingredients.filter((i) => !i.garnish);
  const garnishes = ingredients.filter((i) => i.garnish);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Ingredients</h2>
        <div className="flex items-center gap-1 rounded-lg border border-border p-1">
          {SCALES.map((s) => (
            <Button
              key={s}
              variant={scale === s ? "default" : "ghost"}
              size="sm"
              onClick={() => setScale(s)}
              className={cn(
                "h-7 min-w-[2.5rem] px-2 text-xs",
                scale === s && "bg-amber text-charcoal hover:bg-amber/90"
              )}
            >
              {s}x
            </Button>
          ))}
        </div>
      </div>

      <ul className="space-y-3">
        {mainIngredients.map((ingredient, index) => (
          <li
            key={index}
            className="flex items-start justify-between gap-4 pb-3 border-b border-border/50 last:border-0"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  {ingredient.name}
                </span>
                {ingredient.optional && (
                  <Badge variant="outline" className="text-xs">
                    optional
                  </Badge>
                )}
              </div>
              {ingredient.substitutions && ingredient.substitutions.length > 0 && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Sub: {ingredient.substitutions.join(", ")}
                </p>
              )}
              {ingredient.preparation && (
                <p className="mt-1 text-sm text-muted-foreground italic">
                  {ingredient.preparation}
                </p>
              )}
            </div>
            <div className="text-right tabular-nums text-foreground">
              <span className="font-medium">{formatAmount(ingredient.amount, scale)}</span>
              <span className="ml-1 text-muted-foreground">{ingredient.unit}</span>
            </div>
          </li>
        ))}
      </ul>

      {garnishes.length > 0 && (
        <div className="pt-2">
          <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Garnish
          </h3>
          <ul className="space-y-2">
            {garnishes.map((garnish, index) => (
              <li key={index} className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <span className="text-foreground">{garnish.name}</span>
                  {garnish.preparation && (
                    <p className="mt-1 text-sm text-muted-foreground italic">
                      {garnish.preparation}
                    </p>
                  )}
                </div>
                <div className="text-right tabular-nums text-foreground">
                  <span className="font-medium">{formatAmount(garnish.amount, scale)}</span>
                  <span className="ml-1 text-muted-foreground">{garnish.unit}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
