"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-foreground transition-colors duration-200 hover:text-amber"
        >
          Jigger&Stem
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors duration-200",
              pathname === "/"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Recipes
          </Link>
          <Link
            href="/add"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90",
              pathname === "/add" && "bg-amber text-charcoal hover:bg-amber/90"
            )}
          >
            <Plus className="h-4 w-4" />
            Add Recipe
          </Link>
        </nav>
      </div>
    </header>
  );
}
