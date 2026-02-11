import { useEffect, useMemo, useState } from "react";

const LOCAL_STORAGE_KEY = "chefcito_ingredients";

export type Ingredient = {
  name: string;
  emoji: string;
};

export function useIngredients() {
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

  const ingredientsString = useMemo(() => {
    return ingredients.map((item) => item.name);
  }, [ingredients]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ingredients));
    } catch (error) {
      console.error("Error saving preferences to cache:", error);
    }
  }, [ingredients]);

  function hasIngredient(ingredient: Ingredient) {
    return ingredients.some((item) => item.name === ingredient.name);
  }

  function addIngredient(newIngredient: Ingredient) {
    setIngredients((prev) => [...prev, newIngredient]);
  }

  function removeIngredient(ingredientToRemove: Ingredient) {
    setIngredients((prev) =>
      prev.filter((ingredient) => ingredient.name !== ingredientToRemove.name),
    );
  }

  function clearIngredients() {
    setIngredients([]);
  }

  return {
    ingredients,
    ingredientsString,
    hasIngredient,
    addIngredient,
    removeIngredient,
    clearIngredients,
  };
}
