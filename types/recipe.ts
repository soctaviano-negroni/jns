export interface RecipeImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface RecipeVideo {
  url: string;
  thumbnailUrl: string;
  durationSeconds: number;
}

export interface RecipeMedia {
  images: RecipeImage[];
  video?: RecipeVideo;
}

export interface RecipeMetadata {
  createdAt: string;
  updatedAt: string;
  author: string;
  source: string;
  isOriginal: boolean;
}

export interface RecipeCharacteristics {
  flavor: string[];
  style: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  strength: "Mild" | "Medium-Low" | "Medium" | "Medium-Strong" | "Strong" | "Very Strong";
  season: string[];
}

export interface Ingredient {
  amount: number;
  unit: string;
  name: string;
  substitutions?: string[];
  optional: boolean;
  garnish: boolean;
  preparation?: string;
}

export interface PreparationStep {
  step: number;
  description: string;
}

export interface Preparation {
  prepTimeMinutes: number;
  steps: PreparationStep[];
  method: string;
  tools: string[];
}

export interface RecipeNotes {
  history?: string;
  variations?: string;
  tips?: string;
}

export interface Nutrition {
  calories: number;
  alcoholByVolume: number;
  isVegan: boolean;
  allergens: string[];
}

export interface UserInteraction {
  isFavorite?: boolean;
  rating?: number;
  notes?: string;
}

export interface Recipe {
  id: string;
  name: string;
  metadata: RecipeMetadata;
  media: RecipeMedia;
  characteristics: RecipeCharacteristics;
  baseSpirit: string;
  glass: string;
  ingredients: Ingredient[];
  preparation: Preparation;
  notes: RecipeNotes;
  nutrition: Nutrition;
  tags: string[];
  relatedRecipes?: string[];
  userInteraction?: UserInteraction;
}

export interface FilterOptions {
  spirits: string[];
  strengths: string[];
  difficulties: string[];
  flavors: string[];
}
