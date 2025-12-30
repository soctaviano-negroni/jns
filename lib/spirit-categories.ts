// Spirit category mappings - when filtering by a category, include all variants
export const spiritCategories: Record<string, string[]> = {
  Whiskey: ["Whiskey", "Bourbon", "Rye", "Scotch", "Rye Whiskey"],
  Tequila: ["Tequila", "Mezcal"],
};

// Reverse mapping: variant -> category (for display grouping)
export const spiritToCategory: Record<string, string> = {
  Bourbon: "Whiskey",
  Rye: "Whiskey",
  Scotch: "Whiskey",
  "Rye Whiskey": "Whiskey",
  Mezcal: "Tequila",
};
