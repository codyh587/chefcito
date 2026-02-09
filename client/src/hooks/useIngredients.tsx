import { useState } from "react";

export type Ingredient = {
  name: string;
  emoji: string;
};

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

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

  return {
    ingredients,
    hasIngredient,
    addIngredient,
    removeIngredient,
  };
}
