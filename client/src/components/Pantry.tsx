import { useRef, useState } from "react";

import {
  Camera,
  Check,
  Eraser,
  Loader2,
  Plus,
  Search,
  Settings,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import SearchAsset from "@/assets/search.svg";
import { useFoodPreferences } from "@/contexts/FoodPreferencesContext";
import { useIngredientSearch } from "@/hooks/useIngredientSearch";
import { useIngredients } from "@/hooks/useIngredients";
import { barcodeVision } from "@/lib/barcodeVision";
import { foodVision } from "@/lib/foodVision";
import { toProperCase } from "@/lib/toProperCase";

export function Pantry() {
  const { clearPreferences } = useFoodPreferences();
  const { query, setQuery, results, queryBatchSync } = useIngredientSearch();
  const {
    ingredients,
    hasIngredient,
    addIngredient,
    removeIngredient,
    clearIngredients,
  } = useIngredients();

  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleScan(file: File | undefined) {
    if (!file) {
      return;
    }

    setIsScanning(true);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;

    img.onload = async () => {
      try {
        const barcodeScan = await barcodeVision(img);
        let ingredients = queryBatchSync(barcodeScan);

        if (ingredients.length > 0) {
          ingredients.forEach((ing) => addIngredient(ing));
          return;
        }

        const foodScan = await foodVision(img);
        ingredients = queryBatchSync(foodScan);

        if (ingredients.length > 0) {
          ingredients.forEach((ing) => addIngredient(ing));
          return;
        }
      } catch (err) {
        console.error("Scanning error:", err);
      } finally {
        setIsScanning(false);
        URL.revokeObjectURL(url);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
  }

  return (
    <div className="flex flex-1 flex-col p-5 pb-0">
      {/* header */}
      <div className="bg-chefcito -m-5 mb-5 flex items-center p-5 text-white">
        <div className="px-0.5 text-3xl font-extrabold tracking-wide">
          Pantry
        </div>

        {/* Hidden Camera Input */}
        {/* <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => handleScan(e.target?.files?.[0])}
        />
        <motion.button
          onClick={() => fileInputRef.current?.click()}
          whileTap={{ scale: 0.9 }}
          disabled={isScanning}
          className="mt-0.5 ml-auto flex h-10 w-10 items-center justify-center"
        >
          {isScanning ? (
            <Loader2 size="2rem" className="animate-spin" />
          ) : (
            <Camera size="2rem" />
          )}
        </motion.button> */}

        <motion.button
          onClick={clearIngredients}
          whileTap={{ scale: 0.9 }}
          className="mt-0.5 ml-auto"
        >
          <Eraser size="2rem" />
        </motion.button>
        <motion.button
          onClick={clearPreferences}
          whileTap={{ scale: 0.9 }}
          className="mt-1 ml-7"
        >
          <Settings size="2rem" />
        </motion.button>
      </div>
      {/* search box */}
      <div className="relative z-10 -mb-5">
        <Search className="text-muted-foreground absolute top-1/2 left-4 h-6 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => setQuery("")}
          placeholder={
            isScanning ? "Identifying food..." : "Search ingredients..."
          }
          className="text-muted-foreground bg-background w-full rounded-3xl border-4 border-yellow-400 py-3 pr-4 pl-12 text-lg font-medium transition-colors duration-500 outline-none focus:border-orange-400"
        />
        {/* search results */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 mt-2.5 flex max-h-62 w-full flex-col overflow-y-scroll rounded-3xl border-4 border-yellow-400 bg-white shadow-2xl"
            >
              {results.map((ingredient) => (
                <button
                  key={ingredient.name}
                  onClick={() => addIngredient(ingredient)}
                  className="flex items-center gap-x-2 border-b p-3 transition-colors duration-300 active:bg-yellow-50"
                >
                  <div className="-translate-y-0.5 text-3xl">
                    {ingredient.emoji}
                  </div>
                  <div className="text-lg font-medium">
                    {toProperCase(ingredient.name)}
                  </div>
                  {hasIngredient(ingredient) ? (
                    <Check className="ml-auto h-5 text-green-500" />
                  ) : (
                    <Plus className="text-muted-foreground ml-auto h-5" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* ingredients list */}
      {ingredients.length === 0 ? (
        // empty state
        <div className="m-auto text-center">
          <img
            src={SearchAsset}
            draggable={false}
            className="m-auto mb-3 h-28 rounded-full drop-shadow-lg"
          />
          <div className="mb-1 text-2xl font-medium">No ingredients yet.</div>
          <div className="text-muted-foreground text-lg">
            Add ingredients to start cooking!
          </div>
        </div>
      ) : (
        // non-empty state
        <div className="flex flex-1 basis-0 flex-col gap-y-3 overflow-y-auto pt-8 pb-5">
          <AnimatePresence>
            {ingredients.map((ingredient) => (
              <motion.div
                key={ingredient.name}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 600, damping: 50 }}
                className="flex items-center gap-x-1.5 rounded-3xl border-4 border-green-500 bg-linear-to-r from-green-50 to-green-100 p-2"
              >
                <div className="-translate-y-0.5 text-3xl">
                  {ingredient.emoji}
                </div>
                <div className="truncate text-lg font-medium">
                  {toProperCase(ingredient.name)}
                </div>
                <button
                  onClick={() => removeIngredient(ingredient)}
                  className="text-muted-foreground ml-auto h-7 w-7 rounded-full"
                >
                  <X className="h-5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
