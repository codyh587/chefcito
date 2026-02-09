import { useEffect, useMemo, useState } from "react";

import Fuse from "fuse.js";

import type { Ingredient } from "@/hooks/useIngredients";

type IngredientData = Record<string, string>;

export function useIngredientSearch(resultLimit: number = 10) {
  const [ingredientData, setIngredientData] = useState<IngredientData>({});
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    fetch("/ingredients.json")
      .then((res) => res.json())
      .then((data) => setIngredientData(data))
      .catch((err) => console.error("Failed to load ingredients:", err));
  }, []);

  const fuse = useMemo(
    () => new Fuse(Object.keys(ingredientData), { threshold: 0.3 }),
    [ingredientData],
  );

  const results = useMemo(
    () =>
      fuse
        .search(query)
        .map(
          (r) =>
            ({ name: r.item, emoji: ingredientData[r.item] }) as Ingredient,
        )
        .slice(0, resultLimit),
    [query, fuse, resultLimit, ingredientData],
  );

  return { query, setQuery, results };
}
