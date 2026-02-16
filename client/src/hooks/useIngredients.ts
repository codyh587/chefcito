import { useEffect, useState } from "react";

import { useFoodPreferences } from "@/contexts/FoodPreferencesContext";

const LOCAL_STORAGE_KEY = "chefcito_ingredients";

export type Ingredient = {
  name: string;
  emoji: string;
};

export function useIngredients() {
  const { updatePreferences } = useFoodPreferences();

  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    try {
      const storedPreferences = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedPreferences) {
        return JSON.parse(storedPreferences);
      }
    } catch (error) {
      console.error("Error loading ingredients from cache:", error);
    }
    return [];
  });

  const ingredientsToStringArray = ingredients.map((item) => item.name);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ingredients));
    } catch (error) {
      console.error("Error saving preferences to cache:", error);
    }
  }, [ingredients, updatePreferences]);

  function hasIngredient(ingredient: Ingredient) {
    return ingredients.some((item) => item.name === ingredient.name);
  }

  function addIngredient(newIngredient: Ingredient) {
    updatePreferences({ recipesReady: true });

    setIngredients((prev) =>
      prev.some((item) => item.name === newIngredient.name)
        ? prev
        : [...prev, newIngredient],
    );
  }

  function removeIngredient(ingredientToRemove: Ingredient) {
    updatePreferences({ recipesReady: ingredients.length > 1 });

    setIngredients((prev) =>
      prev.filter((ingredient) => ingredient.name !== ingredientToRemove.name),
    );
  }

  function clearIngredients() {
    setIngredients([]);
  }

  return {
    ingredients,
    ingredientsToStringArray,
    hasIngredient,
    addIngredient,
    removeIngredient,
    clearIngredients,
  };
}
