import { Check, Plus, ScrollText, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import SearchAsset from "@/assets/search.svg";
import { useFoodPreferences } from "@/contexts/FoodPreferencesContext";
import { useIngredientSearch } from "@/hooks/useIngredientSearch";
import { useIngredients } from "@/hooks/useIngredients";
import { toProperCase } from "@/lib/topropercase";

export function Pantry() {
  const { clearPreferences } = useFoodPreferences();
  const { query, setQuery, results } = useIngredientSearch();
  const { ingredients, addIngredients, removeIngredients } = useIngredients();

  return (
    <div className="flex flex-1 flex-col gap-y-5 p-5">
      {/* header */}
      <div className="flex items-center">
        <div className="text-3xl font-medium">My Pantry</div>
        <ScrollText
          onClick={clearPreferences}
          size="1.75rem"
          className="mt-0.5 mr-0.5 ml-auto"
        />
      </div>
      {/* search box */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-4 h-6 -translate-y-1/2 transform" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => setQuery("")}
          placeholder="Search ingredients..."
          className="text-muted-foreground w-full rounded-3xl border-4 border-yellow-400 py-3 pr-4 pl-12 text-lg font-medium shadow-lg transition-colors duration-300 outline-none focus:border-orange-400"
        />
        {/* search results */}
        <AnimatePresence>
          {results.length && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-0 left-0 z-10 mt-2 overflow-hidden rounded-3xl border-4 border-yellow-400 bg-white shadow-2xl"
            >
              <div className="max-h-60 overflow-y-auto">
                {results.map((item) => (
                  <button
                    key={item}
                    onClick={() => addIngredients([item])}
                    className="flex w-full items-center gap-3 border-b p-3 transition-colors duration-300 outline-none active:bg-yellow-50"
                  >
                    <div className="text-2xl">•</div>
                    <div className="flex-1 text-left text-lg font-medium">
                      {toProperCase(item)}
                    </div>
                    {ingredients.has(item) ? (
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
      {ingredients.size === 0 ? (
        <div className="m-auto text-center">
          <img
            src={SearchAsset}
            className="m-auto mb-3 h-28 rounded-full drop-shadow-lg"
          />
          <div className="mb-1 text-2xl font-medium">No ingredients yet.</div>
          <div className="text-muted-foreground text-lg font-medium">
            Add ingredients to start cooking!
          </div>
        </div>
      ) : (
        <div className="flex-1 basis-0 space-y-3 overflow-y-scroll">
          <AnimatePresence>
            {Array.from(ingredients).map((item) => (
              <motion.div
                key={item}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 600, damping: 50 }}
                className="flex w-full items-center gap-3 rounded-2xl border-4 border-green-500 bg-linear-to-r from-green-50 to-green-100 p-2 pl-3.5"
              >
                <div className="flex-1 truncate text-lg font-medium">
                  {toProperCase(item)} rainbowlaterpls
                </div>
                <button
                  onClick={() => removeIngredients([item])}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-300"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Continue Button
      {showContinueButton && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-4 pb-6 text-center"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            disabled={addedItems.length === 0}
            className={`mx-auto flex items-center gap-3 rounded-2xl border-4 border-white px-8 py-4 text-xl font-black shadow-2xl transition-all ${
              addedItems.length > 0
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white active:from-purple-700 active:to-pink-700"
                : "cursor-not-allowed bg-gray-400 text-gray-200"
            } `}
          >
            <Sparkles className="h-6 w-6" />
            ¡A LA BATALLA! ({addedItems.length})
          </motion.button>
          {addedItems.length === 0 && (
            <p className="mt-2 text-sm font-bold text-gray-600">
              Agrega al menos un ingrediente
            </p>
          )} */}
      {/* </motion.div> */}
      {/* //   )} */}
    </div>
  );
}
