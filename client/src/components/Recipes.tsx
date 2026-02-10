import { Bookmark, ChefHat, ChevronRight, Clock, Tag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useRecipes } from "@/hooks/useRecipes";

export function Recipes() {
  const { recipes, getRecipes, clearRecipes } = useRecipes();

  return (
    <div className="flex flex-1 flex-col p-5">
      {/* header */}
      <div className="flex items-center border-b pb-3">
        <div className="text-3xl font-medium">Recipes</div>
        <Button onClick={() => getRecipes()} className="mt-0.5 mr-0.5 ml-auto">
          Request
        </Button>
        <Button onClick={clearRecipes} className="mt-0.5 mr-0.5">
          Reset
        </Button>
      </div>
      {/* recipes */}
      <div className="flex-1 basis-0 space-y-3 overflow-y-auto">
        <AnimatePresence>
          {recipes.map((recipe, index) => (
            <Dialog key={recipe.recipe_title}>
              {/* list view recipe card */}
              <DialogTrigger asChild>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    transition: { delay: index * 0.1 },
                  }}
                  className="flex flex-col rounded-3xl border-4 border-yellow-400 px-5 pt-4 pb-4.5"
                >
                  {/* title */}
                  <div className="mb-2.5 -ml-1.5 flex items-center gap-x-1">
                    <div className="-translate-y-0.5 text-3xl">🍜</div>
                    <div className="text-lg font-semibold">
                      {recipe.recipe_title}
                    </div>
                    <Bookmark
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("Saved recipes coming soon!");
                      }}
                      className="text-muted-foreground ml-auto shrink-0 stroke-[1.5]"
                    />
                    {/* recipe popup (mirrors small card) */}
                    <ChevronRight
                      size="1.75rem"
                      className="text-muted-foreground -mr-1 ml-1.5 shrink-0 stroke-[1.5]"
                    />
                  </div>
                  {/* category */}
                  <div className="mb-4 -ml-0.5 flex w-fit flex-wrap items-center rounded-full border-2 border-purple-300 bg-purple-100 py-1 pr-3 pl-1">
                    <Tag className="mt-0.5 h-3.5 text-purple-600" />
                    <div className="text-sm font-medium text-purple-700">
                      {recipe.category}
                    </div>
                  </div>
                  {/* ingredients/steps info */}
                  <div className="mb-3 -ml-0.5 flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <ChefHat className="h-4 w-4 text-orange-600" />
                      <div className="text-sm font-medium">
                        {recipe.num_ingredients} Ingredient
                        {recipe.num_ingredients > 1 && "s"}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <div className="text-sm font-medium">
                        {recipe.num_steps} Step{recipe.steps > 1 && "s"}
                      </div>
                    </div>
                  </div>
                  {/* description */}
                  <div className="text-muted-foreground text-sm">
                    {recipe.description}
                  </div>
                </motion.div>
              </DialogTrigger>
              {/* recipe popup content */}
              <DialogContent className="max-h-11/12 overflow-y-scroll rounded-3xl border-4 border-yellow-500">
                {/* title */}
                <DialogTitle className="-ml-1.5 flex items-center gap-x-1">
                  <div className="-translate-y-0.5 text-3xl">🍜</div>
                  {recipe.recipe_title}
                </DialogTitle>
                {/* category */}
                <div className="mb-0.5 -ml-0.5 flex w-fit flex-wrap items-center rounded-full border-2 border-purple-300 bg-purple-100 py-1 pr-3 pl-1">
                  <Tag className="mt-0.5 h-3.5 text-purple-600" />
                  <div className="text-sm font-medium text-purple-700">
                    {recipe.subcategory}
                  </div>
                </div>
                {/* ingredients/steps info */}
                <div className="-mb-0.5 -ml-0.5 flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <ChefHat className="h-4 w-4 text-orange-600" />
                    <div className="text-sm font-medium">
                      {recipe.num_ingredients} Ingredient
                      {recipe.num_ingredients > 1 && "s"}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <div className="text-sm font-medium">
                      {recipe.num_steps} Step{recipe.num_steps > 1 && "s"}
                    </div>
                  </div>
                </div>
                {/* description */}
                <DialogDescription>{recipe.description}</DialogDescription>
                <DialogHeader className="text-left text-lg font-semibold">
                  Directions
                </DialogHeader>
                <ol className="list-decimal space-y-1.5 pb-1.5 pl-4 text-sm">
                  {recipe.directions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
              </DialogContent>
            </Dialog>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
