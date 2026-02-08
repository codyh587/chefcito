import { useEffect, useMemo, useState } from "react";

import Fuse from "fuse.js";

export function useIngredientSearch() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    fetch("/ingredients.json")
      .then((res) => res.json())
      .then((data) => setIngredients(data))
      .catch((err) => console.error("Failed to load ingredients:", err));
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(ingredients, {
        includeScore: true,
        threshold: 0.3,
      }),
    [ingredients],
  );

  const results = useMemo(
    () => (query ? fuse.search(query).map((r) => r.item) : ingredients),
    [query, fuse, ingredients],
  );

  return { query, setQuery, results };
}
