import { useCallback, useState } from "react";

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Set<string>>(new Set());

  const addIngredients = useCallback((newIngredients: string[]) => {
    setIngredients((prev) => new Set([...prev, ...newIngredients]));
  }, []);

  const removeIngredients = useCallback((ingredientsToRemove: string[]) => {
    setIngredients((prev) => {
      const updated = new Set(prev);
      ingredientsToRemove.forEach((ing) => updated.delete(ing));
      return updated;
    });
  }, []);

  return {
    ingredients,
    addIngredients,
    removeIngredients,
  };
}
