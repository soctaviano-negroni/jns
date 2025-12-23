import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonInput } from "@/components/add/JsonInput";

export const metadata = {
  title: "Add Recipe | Cocktail Recipes",
  description: "Add a new cocktail recipe to your collection",
};

export default function AddRecipePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="container mx-auto max-w-3xl px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Add Recipe
            </h1>
            <p className="mt-2 text-muted-foreground">
              Paste your recipe JSON below to add it to your collection. The recipe
              will be stored locally in your browser.
            </p>
          </div>

          <JsonInput />

          <div className="mt-12 rounded-lg border border-border bg-muted/30 p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Recipe Format
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your recipe JSON should include at minimum:
            </p>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              <li>
                <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">name</code>{" "}
                - The cocktail name
              </li>
              <li>
                <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">baseSpirit</code>{" "}
                - Primary spirit (e.g., "Gin", "Bourbon")
              </li>
              <li>
                <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">ingredients</code>{" "}
                - Array of ingredients with amount, unit, and name
              </li>
              <li>
                <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">preparation</code>{" "}
                - Object with steps array
              </li>
            </ul>

            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-amber hover:text-amber-dark">
                View example JSON
              </summary>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-charcoal p-4 text-xs text-cream">
{`{
  "name": "Old Fashioned",
  "baseSpirit": "Bourbon",
  "glass": "Rocks",
  "characteristics": {
    "flavor": ["Sweet", "Smooth"],
    "strength": "Strong",
    "difficulty": "Beginner"
  },
  "ingredients": [
    {
      "amount": 2,
      "unit": "oz",
      "name": "Bourbon",
      "optional": false,
      "garnish": false
    },
    {
      "amount": 0.25,
      "unit": "oz",
      "name": "Simple Syrup",
      "optional": false,
      "garnish": false
    },
    {
      "amount": 2,
      "unit": "dashes",
      "name": "Angostura Bitters",
      "optional": false,
      "garnish": false
    }
  ],
  "preparation": {
    "prepTimeMinutes": 3,
    "method": "Stirred",
    "steps": [
      { "step": 1, "description": "Add all ingredients to a mixing glass" },
      { "step": 2, "description": "Add ice and stir for 30 seconds" },
      { "step": 3, "description": "Strain over a large ice cube" }
    ],
    "tools": ["Mixing glass", "Bar spoon", "Strainer"]
  }
}`}
              </pre>
            </details>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
