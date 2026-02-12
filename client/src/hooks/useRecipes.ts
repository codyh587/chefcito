import { useEffect, useState } from "react";

import { useFoodPreferences } from "@/contexts/FoodPreferencesContext";
import { useIngredients } from "@/hooks/useIngredients";

const LOCAL_STORAGE_KEY = "chefcito_recipes";

export type Recipe = {
  recipe_id: number;
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

  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const storedRecipes = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedRecipes) {
        return JSON.parse(storedRecipes);
      }
    } catch (error) {
      console.error("Error loading recipes from cache:", error);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recipes));
    } catch (error) {
      console.error("Error saving preferences to cache:", error);
    }
  }, [recipes]);

  async function getRecipes(resultLimit: number = 10) {
    try {
      setRecipes([]);
      setLoading(true);

      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: ingredientsString,
          allergens: [],
          pastry: false,
          max_num_ingredients: 100,
          max_cook_time: 100,
          spice: 1,
          protein_filled: preferences.surveyFinished || false,
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

    setLoading(false);
  }

  return {
    loading,
    recipes,
    getRecipes,
  };
}
