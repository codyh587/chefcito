import { Button } from "@/components/ui/button";

import { useRecipes } from "@/hooks/useRecipes";

export function Recipes() {
  const { recipes, getRecipes, clearRecipes } = useRecipes();

  return (
    <div className="flex-1">
      <h1 className="m-auto text-2xl font-bold">Recipes</h1>
      <Button onClick={() => getRecipes()} className="mt-4">
        Get Recipes
      </Button>
      <Button onClick={clearRecipes} className="mt-2">
        Clear Recipes
      </Button>
      {recipes.map((item) => (
        <div key={item.recipe_title}>{item.recipe_title}</div>
      ))}
    </div>
  );
}
