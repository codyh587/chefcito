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
  const { ingredientsString } = useIngredients();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const getRecipes = useCallback(
    async (resultLimit: number = 10) => {
      try {
        const response = await fetch("http://localhost:8000/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ingredients: ingredientsString,
            allergens: [],
            pastry: false,
            max_num_ingredients: 100,
            max_cook_time: 100,
            spice: 1,
            protein_filled: true,
            loose: false,
            limit: resultLimit,
          }),
        });
        const body = await response.json();
        setRecipes(body.data || []);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
        setRecipes([]);
      }
    },
    [ingredientsString, preferences],
  );

  function clearRecipes() {
    setRecipes([]);
  }

  return {
    recipes,
    getRecipes,
    clearRecipes,
  };
}
