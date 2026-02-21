import {
  Bookmark,
  ChefHat,
  ChevronRight,
  Clock,
  Eraser,
  Tag,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import BookmarkAsset from "@/assets/bookmark.svg";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";

export function Saved() {
  const { savedRecipes, isSavedRecipe, toggleSavedRecipe, clearSavedRecipes } =
    useSavedRecipes();

  return (
    <div className="flex flex-1 flex-col p-5 pb-0">
      {/* header */}
      <div className="bg-chefcito -m-5 flex items-center p-5 text-white">
        <div className="px-0.5 text-3xl font-extrabold tracking-wide">
          Saved
        </div>
        <motion.button
          onClick={() => clearSavedRecipes()}
          whileTap={{ scale: 0.9 }}
          className="mt-0.5 ml-auto"
        >
          <Eraser size="2rem" />
        </motion.button>
      </div>
      {/* recipes list */}
      <div className="mt-5 -ml-5 flex flex-1 basis-0 flex-col gap-y-3 overflow-y-auto py-5 pl-5">
        {savedRecipes.length === 0 ? (
          <div className="m-auto text-center">
            <img
              src={BookmarkAsset}
              draggable={false}
              className="m-auto mt-14.75 mb-3 h-28 rounded-full drop-shadow-lg"
            />
            <div className="mb-1 text-2xl font-medium">No recipes saved.</div>
            <div className="text-muted-foreground text-lg">
              Find and save recipes to show them here!
            </div>
          </div>
        ) : (
          // non empty state
          <AnimatePresence>
            {savedRecipes.map((recipe, index) => (
              // invisible dialog popup header
              <Dialog key={recipe.recipe_id}>
                <DialogTrigger asChild>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{
                      x: 0,
                      opacity: 1,
                      transition: {
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      },
                    }}
                    className="flex flex-col rounded-3xl border-4 border-yellow-400 px-5 pt-4 pb-4.5"
                  >
                    {/* title */}
                    <div className="mb-3.5 -ml-1.5 flex items-center gap-x-1">
                      <div className="-translate-y-0.5 text-3xl">
                        {recipe.emoji}
                      </div>
                      <div className="text-lg font-semibold">
                        {recipe.recipe_title}
                      </div>
                      <Bookmark
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSavedRecipe(recipe);
                        }}
                        className={`text-muted-foreground ml-auto shrink-0 stroke-[1.5] ${isSavedRecipe(recipe) && "fill-purple-500 stroke-purple-500"}`}
                      />
                      <ChevronRight
                        size="1.75rem"
                        className="text-muted-foreground -mr-1 ml-1.5 shrink-0 stroke-[1.5]"
                      />
                    </div>
                    {/* category */}
                    <div className="mb-4.5 -ml-0.5 flex w-fit items-center rounded-full border-2 border-purple-300 bg-purple-100 p-1 pr-3">
                      <Tag className="mt-0.5 h-3.5 text-purple-600" />
                      <div className="text-sm font-medium text-purple-700">
                        {recipe.subcategory}
                      </div>
                    </div>
                    {/* ingredients/steps info */}
                    <div className="mb-3 -ml-0.5 flex items-center gap-x-3">
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
                    <div className="text-muted-foreground text-sm">
                      {recipe.description}
                    </div>
                  </motion.div>
                </DialogTrigger>
                {/* recipe popup content */}
                <DialogContent className="scrollbar-hide max-h-10/12 overflow-y-auto rounded-3xl border-4 border-yellow-500 select-none">
                  {/* title */}
                  <DialogTitle className="-mb-0.5 -ml-1.5 flex items-center gap-x-1">
                    <div className="-translate-y-0.5 text-3xl">
                      {recipe.emoji}
                    </div>
                    {recipe.recipe_title}
                  </DialogTitle>
                  {/* category */}
                  <div className="mb-0.5 -ml-0.5 flex w-fit items-center rounded-full border-2 border-purple-300 bg-purple-100 py-1 pr-3 pl-1">
                    <Tag className="mt-0.5 h-3.5 text-purple-600" />
                    <div className="text-sm font-medium text-purple-700">
                      {recipe.subcategory}
                    </div>
                  </div>
                  {/* ingredients/steps info */}
                  <div className="-mb-0.5 -ml-0.5 flex items-center gap-x-3">
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
                  {/* ingredients */}
                  <DialogHeader className="text-left text-lg font-semibold">
                    Ingredients
                  </DialogHeader>
                  <ol className="list-disc space-y-1.5 pl-4 text-sm">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ol>
                  {/* directions */}
                  <DialogHeader className="text-left text-lg font-semibold">
                    Directions
                  </DialogHeader>
                  <ol className="list-decimal space-y-1.5 pb-1.5 pl-4 text-sm">
                    {recipe.directions.map((direction, index) => (
                      <li key={index}>{direction}</li>
                    ))}
                  </ol>
                </DialogContent>
              </Dialog>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
