"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Recipe } from "@/types/recipe";
import { addRecipe, generateId, validateRecipe } from "@/lib/recipes";
import { cn } from "@/lib/utils";

interface ParsedRecipe {
  data: Recipe | null;
  errors: string[];
}

export function JsonInput() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<ParsedRecipe>({ data: null, errors: [] });
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const parseInput = useCallback((value: string) => {
    setInput(value);
    setSaved(false);

    if (!value.trim()) {
      setParsed({ data: null, errors: [] });
      return;
    }

    try {
      const data = JSON.parse(value);
      const validation = validateRecipe(data);

      if (validation.valid) {
        // Ensure the recipe has an ID
        const recipe = {
          ...data,
          id: data.id || generateId(),
        } as Recipe;
        setParsed({ data: recipe, errors: [] });
      } else {
        setParsed({ data: null, errors: validation.errors });
      }
    } catch (e) {
      setParsed({ data: null, errors: ["Invalid JSON syntax"] });
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!parsed.data) return;

    setIsSaving(true);

    try {
      addRecipe(parsed.data);
      setSaved(true);

      // Navigate to the new recipe after a short delay
      setTimeout(() => {
        router.push(`/recipes/${parsed.data!.id}`);
      }, 1000);
    } catch (e) {
      setParsed((prev) => ({
        ...prev,
        errors: ["Failed to save recipe"],
      }));
    } finally {
      setIsSaving(false);
    }
  }, [parsed.data, router]);

  const isValid = parsed.data !== null && parsed.errors.length === 0;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="json-input"
            className="text-sm font-medium text-foreground"
          >
            Recipe JSON
          </label>
          {parsed.data && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="h-8 text-muted-foreground"
            >
              {showPreview ? (
                <>
                  <EyeOff className="mr-1.5 h-4 w-4" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye className="mr-1.5 h-4 w-4" />
                  Show Preview
                </>
              )}
            </Button>
          )}
        </div>

        <textarea
          id="json-input"
          value={input}
          onChange={(e) => parseInput(e.target.value)}
          placeholder='Paste your recipe JSON here...\n\nExample:\n{\n  "name": "Old Fashioned",\n  "baseSpirit": "Bourbon",\n  ...\n}'
          className={cn(
            "h-80 w-full resize-none rounded-lg border bg-card p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
            parsed.errors.length > 0 && input && "border-destructive focus:ring-destructive",
            isValid && "border-green-500/50 focus:ring-green-500/50"
          )}
        />
      </div>

      {/* Validation Status */}
      {input && (
        <div className="space-y-2">
          {parsed.errors.length > 0 ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                <AlertCircle className="h-4 w-4" />
                Validation Errors
              </div>
              <ul className="mt-2 space-y-1 text-sm text-destructive/80">
                {parsed.errors.map((error, i) => (
                  <li key={i}>• {error}</li>
                ))}
              </ul>
            </div>
          ) : isValid ? (
            <div className="rounded-lg border border-green-500/50 bg-green-500/5 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                <Check className="h-4 w-4" />
                Valid recipe JSON
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Preview */}
      {showPreview && parsed.data && (
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Preview</h3>

          <div className="space-y-3">
            <div>
              <span className="text-sm text-muted-foreground">Name:</span>
              <p className="font-medium text-foreground">{parsed.data.name}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{parsed.data.baseSpirit}</Badge>
              {parsed.data.characteristics?.strength && (
                <Badge variant="outline">{parsed.data.characteristics.strength}</Badge>
              )}
              {parsed.data.characteristics?.difficulty && (
                <Badge variant="outline">{parsed.data.characteristics.difficulty}</Badge>
              )}
            </div>

            <div>
              <span className="text-sm text-muted-foreground">Ingredients:</span>
              <ul className="mt-1 text-sm text-foreground">
                {parsed.data.ingredients?.slice(0, 5).map((ing, i) => (
                  <li key={i}>
                    {ing.amount} {ing.unit} {ing.name}
                  </li>
                ))}
                {parsed.data.ingredients?.length > 5 && (
                  <li className="text-muted-foreground">
                    +{parsed.data.ingredients.length - 5} more...
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleSave}
          disabled={!isValid || isSaving || saved}
          className={cn(
            "min-w-32",
            saved && "bg-green-600 hover:bg-green-600"
          )}
        >
          {saved ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saved!
            </>
          ) : isSaving ? (
            "Saving..."
          ) : (
            "Add Recipe"
          )}
        </Button>

        {!isValid && input && (
          <p className="text-sm text-muted-foreground">
            Fix validation errors to save
          </p>
        )}
      </div>
    </div>
  );
}
