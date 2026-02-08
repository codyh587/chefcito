import { useCallback, useState } from "react";

import { useFoodPreferences } from "@/contexts/FoodPreferencesContext";
import { useIngredients } from "@/hooks/useIngredients";

export type Recipe = {
  recipe_title: string;
  category: string;
  subcategory: string;
  description: string;
  ingredients: string[];
  directions: string[];
  num_ingredients: number;
  num_steps: number;
};

export function useRecipes() {
  const { preferences } = useFoodPreferences();
  const { ingredients } = useIngredients();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const getRecipes = useCallback(async () => {
    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: Array.from(ingredients),
          allergens: [],
          pastry: false,
          max_prep_time: 100,
          max_cook_time: 100,
          spice: 0,
          protein_filled: preferences?.protein || false,
          loose: true,
          num_reccomendations: 5,
        }),
      });
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }
  }, [ingredients, preferences]);

  const clearRecipes = useCallback(() => {
    setRecipes([]);
  }, []);

  return {
    recipes,
    getRecipes,
    clearRecipes,
  };
}
