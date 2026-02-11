import { Check, Eraser, Plus, Search, Settings, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import SearchAsset from "@/assets/search.svg";
import { useFoodPreferences } from "@/contexts/FoodPreferencesContext";
import { useIngredientSearch } from "@/hooks/useIngredientSearch";
import { useIngredients } from "@/hooks/useIngredients";
import { toProperCase } from "@/lib/toProperCase";

export function Pantry() {
  const { clearPreferences } = useFoodPreferences();
  const { query, setQuery, results } = useIngredientSearch();
  const {
    ingredients,
    hasIngredient,
    addIngredient,
    removeIngredient,
    clearIngredients,
  } = useIngredients();

  return (
    <div className="flex flex-1 flex-col p-5 pb-0">
      {/* header */}
      <div className="bg-chefcito -m-5 mb-5 flex items-center p-5 text-white">
        <div className="px-0.5 text-3xl font-black tracking-wide">Pantry</div>
        <Eraser
          onClick={clearIngredients}
          size="2rem"
          className="mt-0.5 ml-auto text-shadow-lg"
        />
        <Settings
          onClick={clearPreferences}
          size="2rem"
          className="mt-1 ml-7 text-shadow-lg"
        />
      </div>
      {/* search box */}
      <div className="relative z-10 -mb-5">
        <Search className="text-muted-foreground absolute top-1/2 left-4 h-6 -translate-y-1/2 transform" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => setQuery("")}
          placeholder="Search ingredients..."
          className="text-muted-foreground bg-background w-full rounded-3xl border-4 border-yellow-400 py-3 pr-4 pl-12 text-lg font-medium transition-colors duration-500 focus:border-orange-400"
        />
        {/* search results */}
        <AnimatePresence>
          {results.length && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-0 left-0 z-10 mt-2.5 overflow-hidden rounded-3xl border-4 border-yellow-400 bg-white shadow-2xl"
            >
              <div className="max-h-60 overflow-y-auto">
                {results.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => !hasIngredient(item) && addIngredient(item)}
                    className="flex w-full items-center gap-x-2 border-b p-3 transition-colors duration-300 outline-none active:bg-yellow-50"
                  >
                    <div className="-translate-y-0.5 text-3xl">
                      {item.emoji}
                    </div>
                    <div className="flex-1 text-left text-lg font-medium">
                      {toProperCase(item.name)}
                    </div>
                    {hasIngredient(item) ? (
                      <Check className="h-5 text-green-500" />
                    ) : (
                      <Plus className="text-muted-foreground h-5" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* ingredients list */}
      {ingredients.length === 0 ? (
        <div className="m-auto text-center">
          <img
            src={SearchAsset}
            draggable={false}
            className="m-auto mb-3 h-28 rounded-full drop-shadow-lg"
          />
          <div className="mb-1 text-2xl font-medium">No ingredients yet.</div>
          <div className="text-muted-foreground text-lg font-medium">
            Add ingredients to start cooking!
          </div>
        </div>
      ) : (
        <div className="flex-1 basis-0 overflow-y-auto">
          <AnimatePresence>
            {ingredients.map((item) => (
              <motion.div
                key={item.name}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 600, damping: 50 }}
                className="mt-3 flex w-full items-center gap-x-1.5 rounded-3xl border-4 border-green-500 bg-linear-to-r from-green-50 to-green-100 p-2 first:mt-8"
              >
                <div className="-translate-y-0.5 text-3xl">{item.emoji}</div>
                <div className="flex-1 truncate text-lg font-medium">
                  {toProperCase(item.name)}
                </div>
                <button
                  onClick={() => removeIngredient(item)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
