import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Wine, Droplets, Flame, BookOpen } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IngredientList } from "@/components/recipes/IngredientList";
import { PreparationSteps } from "@/components/recipes/PreparationSteps";
import { getBaseRecipes, getRecipeById } from "@/lib/recipes";

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const recipes = getBaseRecipes();
  return recipes.map((recipe) => ({
    id: recipe.id,
  }));
}

export async function generateMetadata({ params }: RecipePageProps) {
  const { id } = await params;
  const recipe = getRecipeById(id);

  if (!recipe) {
    return { title: "Recipe Not Found" };
  }

  return {
    title: `${recipe.name} | Cocktail Recipes`,
    description: `Learn how to make a ${recipe.name}. ${recipe.characteristics?.flavor?.slice(0, 3).join(", ")} cocktail made with ${recipe.baseSpirit}.`,
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;
  const recipe = getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  const primaryImage = recipe.media?.images?.find((img) => img.isPrimary) ?? recipe.media?.images?.[0];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to recipes
          </Link>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted lg:sticky lg:top-24 lg:aspect-[3/4] lg:self-start">
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.alt || recipe.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Wine className="h-24 w-24 text-muted-foreground/30" />
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {recipe.name}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-sm">
                    {recipe.baseSpirit}
                  </Badge>
                  {recipe.characteristics?.strength && (
                    <Badge variant="outline" className="text-sm">
                      {recipe.characteristics.strength}
                    </Badge>
                  )}
                  {recipe.characteristics?.difficulty && (
                    <Badge variant="outline" className="text-sm">
                      {recipe.characteristics.difficulty}
                    </Badge>
                  )}
                  {recipe.glass && (
                    <Badge variant="outline" className="text-sm">
                      {recipe.glass}
                    </Badge>
                  )}
                </div>

                {recipe.characteristics?.flavor && recipe.characteristics.flavor.length > 0 && (
                  <p className="mt-4 text-muted-foreground">
                    {recipe.characteristics.flavor.join(" · ")}
                  </p>
                )}
              </div>

              <Separator />

              {/* Ingredients */}
              <IngredientList ingredients={recipe.ingredients} />

              <Separator />

              {/* Preparation */}
              <PreparationSteps preparation={recipe.preparation} />

              {/* Notes */}
              {recipe.notes && (recipe.notes.history || recipe.notes.tips || recipe.notes.variations) && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Notes</h2>

                    {recipe.notes.history && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          History
                        </div>
                        <p className="text-foreground leading-relaxed">
                          {recipe.notes.history}
                        </p>
                      </div>
                    )}

                    {recipe.notes.variations && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Droplets className="h-4 w-4" />
                          Variations
                        </div>
                        <p className="text-foreground leading-relaxed">
                          {recipe.notes.variations}
                        </p>
                      </div>
                    )}

                    {recipe.notes.tips && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Flame className="h-4 w-4" />
                          Tips
                        </div>
                        <p className="text-foreground leading-relaxed">
                          {recipe.notes.tips}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Nutrition */}
              {recipe.nutrition && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-foreground">Nutrition</h2>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {recipe.nutrition.calories > 0 && (
                        <div>
                          <span className="text-muted-foreground">Calories:</span>{" "}
                          <span className="font-medium text-foreground">{recipe.nutrition.calories}</span>
                        </div>
                      )}
                      {recipe.nutrition.alcoholByVolume > 0 && (
                        <div>
                          <span className="text-muted-foreground">ABV:</span>{" "}
                          <span className="font-medium text-foreground">{recipe.nutrition.alcoholByVolume}%</span>
                        </div>
                      )}
                      {recipe.nutrition.isVegan && (
                        <Badge variant="outline">Vegan</Badge>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Source */}
              {recipe.metadata?.source && (
                <p className="text-sm text-muted-foreground">
                  Source: {recipe.metadata.source}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
