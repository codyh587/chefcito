import { useEffect, useState } from "react";

import Fuse from "fuse.js";

import type { Ingredient } from "@/hooks/useIngredients";

type IngredientData = Record<string, string>;

export function useIngredientSearch(resultLimit: number = 10) {
  const [ingredientData, setIngredientData] = useState<IngredientData>({});
  const [query, setQuery] = useState<string>("");

  const fuse = new Fuse(Object.keys(ingredientData), { threshold: 0.4 });

  const results = fuse
    .search(query)
    .slice(0, resultLimit)
    .map(
      (result) =>
        ({
          name: result.item,
          emoji: ingredientData[result.item],
        }) as Ingredient,
    );

  useEffect(() => {
    fetch("/ingredients.json")
      .then((res) => res.json())
      .then((data) => setIngredientData(data))
      .catch((err) => console.error("Failed to load ingredients:", err));
  }, []);

  function queryBatchSync(queries: string[]) {
    const results: Ingredient[] = [];

    queries.forEach((query) => {
      const result = fuse
        .search(query)
        .slice(0, 1)
        .map(
          (result) =>
            ({
              name: result.item,
              emoji: ingredientData[result.item],
            }) as Ingredient,
        );
      results.push(...result);
    });

    return results;
  }

  return { query, setQuery, results, queryBatchSync };
}
