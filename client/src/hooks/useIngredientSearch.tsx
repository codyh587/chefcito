import { useEffect, useMemo, useState } from "react";

import Fuse from "fuse.js";

export function useIngredientSearch(resultLimit: number = 10) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    fetch("/ingredients.json")
      .then((res) => res.json())
      .then((data) => setIngredients(Array.from(new Set(data))))
      .catch((err) => console.error("Failed to load ingredients:", err));
  }, []);

  const fuse = useMemo(
    () => new Fuse(ingredients, { threshold: 0.3 }),
    [ingredients],
  );

  const results = useMemo(
    () =>
      fuse
        .search(query)
        .map((r) => r.item)
        .slice(0, resultLimit),
    [query, fuse, resultLimit],
  );

  return { query, setQuery, results };
}
