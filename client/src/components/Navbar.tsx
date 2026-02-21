import type { Dispatch, SetStateAction } from "react";

import { Bookmark, ShoppingBasket } from "lucide-react";
import { motion } from "motion/react";

import { useFoodPreferences } from "@/contexts/FoodPreferencesContext";
import type { Page } from "@/pages/Dashboard";

export function Navbar({
  setPage,
}: {
  setPage: Dispatch<SetStateAction<Page>>;
}) {
  const {
    preferences: { recipesReady },
  } = useFoodPreferences();

  return (
    <div className="text-muted-foreground flex text-center font-medium outline">
      <motion.button
        onClick={() => setPage("pantry")}
        whileTap={{ scale: 0.9 }}
        className="m-auto flex-1 py-3 text-sm"
      >
        <ShoppingBasket className="m-auto" size="1.75rem" />
        Pantry
      </motion.button>
      <div className="flex-1">
        <motion.img
          onClick={() => setPage("recipes")}
          whileTap={{ scale: 0.9 }}
          src="/logo.svg"
          draggable={false}
          className={`absolute bottom-4 left-1/2 h-20 -translate-x-1/2 rounded-full outline [transition:filter_0.4s,rotate_0.4s] ${!recipesReady && "-rotate-10 grayscale"}`}
        />
      </div>
      <motion.button
        onClick={() => setPage("saved")}
        whileTap={{ scale: 0.9 }}
        className="m-auto flex-1 py-3 text-sm"
      >
        <Bookmark className="m-auto" size="1.75rem" />
        Saved
      </motion.button>
    </div>
  );
}
