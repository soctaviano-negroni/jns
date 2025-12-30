"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back();
    } else {
      // Fallback to home if no history
      router.push("/");
    }
  };

  return (
    <button
      onClick={handleBack}
      className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to recipes
    </button>
  );
}
