import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RecipeExplorer } from "@/components/recipes/RecipeExplorer";
import { getBaseRecipes, getFilterOptions } from "@/lib/recipes";

export default function HomePage() {
  const recipes = getBaseRecipes();
  const filterOptions = getFilterOptions();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="container mx-auto px-4 py-12">
          <div className="mb-12 max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Craft Cocktails
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              A curated collection of cocktail recipes, from classic
              standards to contemporary creations.
            </p>
          </div>

          <RecipeExplorer initialRecipes={recipes} filterOptions={filterOptions} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
