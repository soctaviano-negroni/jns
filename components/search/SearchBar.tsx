"use client";

import { useCallback, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
  className?: string;
}

export function SearchBar({ value, onChange, resultCount, className }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = useCallback(() => {
    onChange("");
  }, [onChange]);

  return (
    <div className={cn("relative", className)}>
      <Search
        className={cn(
          "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
          isFocused ? "text-foreground" : "text-muted-foreground"
        )}
      />
      <Input
        type="text"
        placeholder="Search cocktails..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="h-11 pl-10 pr-10 text-base"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {resultCount !== undefined && value && (
        <div className="absolute -bottom-6 left-0 text-sm text-muted-foreground">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </div>
      )}
    </div>
  );
}
