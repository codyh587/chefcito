import { useRecipes } from "@/hooks/useRecipes";

export function Recipes() {
  const { recipes, getRecipes, clearRecipes } = useRecipes();

  return (
    <div className="flex-1">
      <h1 className="m-auto text-2xl font-bold">Recipes</h1>
      {recipes.map((item) => (
        <div>{item.recipe_title}</div>
      ))}
    </div>
  );
}
