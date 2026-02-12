import { useState } from "react";

import { Bookmark, ChefHat, ShoppingBasket } from "lucide-react";
import { motion } from "motion/react";

import { Pantry } from "@/components/Pantry";
import { Recipes } from "@/components/Recipes";
import { Saved } from "@/components/Saved";

type Page = "pantry" | "recipes" | "saved";

export function Dashboard() {
  const [page, setPage] = useState<Page>("pantry");

  return (
    <div className="bg-background relative flex h-full min-h-screen w-full flex-col">
      {/* main page view */}
      {page === "pantry" ? (
        <Pantry />
      ) : page === "recipes" ? (
        <Recipes />
      ) : page === "saved" ? (
        <Saved />
      ) : null}
      {/* navbar */}
      <div className="flex h-fit outline">
        <motion.button
          onClick={() => setPage("pantry")}
          whileTap={{ scale: 0.9 }}
          className="text-muted-foreground m-auto block flex-1 py-3 text-center font-medium"
        >
          <ShoppingBasket className="m-auto" size="2rem" />
          Pantry
        </motion.button>
        <motion.button
          onClick={() => setPage("recipes")}
          className="text-muted-foreground m-auto block flex-1 py-3 text-center font-medium"
        >
          <ChefHat className="m-auto" size="2rem" />
          Recipes
          <motion.img
            src="/logo.svg"
            onClick={() => setPage("recipes")}
            whileTap={{ scale: 0.9 }}
            draggable={false}
            className="absolute bottom-4 left-1/2 h-24 -translate-x-1/2 rounded-full outline"
          />
        </motion.button>
        <motion.button
          onClick={() => setPage("saved")}
          whileTap={{ scale: 0.9 }}
          className="text-muted-foreground m-auto block flex-1 py-3 text-center font-medium"
        >
          <Bookmark className="m-auto" size="2rem" />
          Saved
        </motion.button>
      </div>
    </div>
  );
}
