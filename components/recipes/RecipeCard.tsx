"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Wine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Recipe } from "@/types/recipe";
import { cn } from "@/lib/utils";

interface RecipeCardProps {
  recipe: Recipe;
  index?: number;
}

export function RecipeCard({ recipe, index = 0 }: RecipeCardProps) {
  const primaryImage = recipe.media?.images?.find((img) => img.isPrimary) ?? recipe.media?.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: "easeOut",
      }}
    >
      <Link href={`/recipes/${recipe.id}`} className="group block">
        <article className="overflow-hidden rounded-lg bg-card transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || recipe.name}
                fill
                className="object-cover transition-all duration-300 ease-out group-hover:opacity-90 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Wine className="h-12 w-12 text-muted-foreground/50" />
              </div>
            )}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
              <Badge
                variant="secondary"
                className="bg-background/90 text-foreground backdrop-blur-sm"
              >
                {recipe.baseSpirit}
              </Badge>
              {recipe.characteristics?.strength && (
                <Badge
                  variant="outline"
                  className={cn(
                    "border-background/50 bg-background/80 backdrop-blur-sm",
                    recipe.characteristics.strength === "Strong" && "border-amber/50 text-amber-dark",
                    recipe.characteristics.strength === "Very Strong" && "border-amber text-amber-dark"
                  )}
                >
                  {recipe.characteristics.strength}
                </Badge>
              )}
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {recipe.name}
            </h3>

            <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
              {recipe.preparation?.prepTimeMinutes && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {recipe.preparation.prepTimeMinutes} min
                </span>
              )}
              {recipe.characteristics?.difficulty && (
                <span>{recipe.characteristics.difficulty}</span>
              )}
            </div>

            {recipe.characteristics?.flavor && recipe.characteristics.flavor.length > 0 && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-1">
                {recipe.characteristics.flavor.slice(0, 3).join(" · ")}
              </p>
            )}
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
