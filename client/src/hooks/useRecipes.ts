import { useEffect, useState } from "react";

import { useFoodPreferences } from "@/contexts/FoodPreferencesContext";
import { useIngredients } from "@/hooks/useIngredients";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";

const LOCAL_STORAGE_KEY = "chefcito_recipes";

export type Recipe = {
  recipe_id: number;
  recipe_title: string;
  emoji: string;
  category: string;
  subcategory: string;
  description: string;
  ingredients: string[];
  clean_ingredients: string[];
  directions: string[];
  num_ingredients: number;
  num_steps: number;
};

export function useRecipes() {
  const { preferences, updatePreferences } = useFoodPreferences();
  const { ingredients } = useIngredients();
  const { savedRecipes } = useSavedRecipes();

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
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: ingredients.map((ingredient) => ingredient.name),
          allergens: preferences.allergens || [],
          pastry: preferences.pastry || false,
          max_num_ingredients: preferences.maxNumIngredients || 10,
          max_cook_time: preferences.maxCookTime || 30,
          spice: preferences.spice || 0.25,
          protein_filled: preferences.proteinFilled || false,
          loose: preferences.loose || true,
          limit: resultLimit,
          liked: savedRecipes.map((recipe) => recipe.recipe_id),
        }),
      });

      const body = await response.json();
      setRecipes(body.data || []);
      updatePreferences({ recipesReady: false });
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }

    setLoading(false);
  }

  return {
    loading,
    recipes,
    getRecipes,
  };
}
