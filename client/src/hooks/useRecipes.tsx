import { useCallback, useEffect, useState } from "react";

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
      const response = await fetch("http://localhost:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: Array.from(ingredients),
          allergens: [],
          pastry: false,
          max_prep_time: 100,
          max_cook_time: 100,
          spice: 1,
          protein_filled: false,
          loose: true,
          num_reccomendations: 5,
        }),
      });

      const data = await response.json();
      console.log(data);
      setRecipes(data.data);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }
  }, [ingredients, preferences]);

  function clearRecipes() {
    setRecipes([]);
  }

  useEffect(() => {
    setTimeout(() => {
      getRecipes();
    }, 0);
  }, [getRecipes]);

  return {
    recipes,
    getRecipes,
    clearRecipes,
  };
}
