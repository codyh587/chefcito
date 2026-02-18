import { useEffect, useState } from "react";

import type { Recipe } from "@/hooks/useRecipes";

const LOCAL_STORAGE_KEY = "chefcito_saved_recipes";

export function useSavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>(() => {
    try {
      const storedPreferences = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedPreferences) {
        return JSON.parse(storedPreferences);
      }
    } catch (error) {
      console.error("Error loading saved recipes from cache:", error);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedRecipes));
    } catch (error) {
      console.error("Error saving saved recipes to cache:", error);
    }
  }, [savedRecipes]);

  function isSavedRecipe(recipe: Recipe) {
    return savedRecipes.some((rec) => rec.recipe_id === recipe.recipe_id);
  }

  function toggleSavedRecipe(recipe: Recipe) {
    if (isSavedRecipe(recipe)) {
      setSavedRecipes((prev) =>
        prev.filter((rec) => rec.recipe_id !== recipe.recipe_id),
      );
    } else {
      setSavedRecipes((prev) =>
        prev.some((rec) => rec.recipe_id === recipe.recipe_id)
          ? prev
          : [...prev, recipe],
      );
    }
  }

  function clearSavedRecipes() {
    setSavedRecipes([]);
  }

  return {
    savedRecipes,
    isSavedRecipe,
    toggleSavedRecipe,
    clearSavedRecipes,
  };
}
