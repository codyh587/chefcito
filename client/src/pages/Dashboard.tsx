import { useState } from "react";

import { Bookmark, ShoppingBasket } from "lucide-react";
import { motion } from "motion/react";

import { Pantry } from "@/components/Pantry";
import { Recipes } from "@/components/Recipes";
import { Saved } from "@/components/Saved";

type Page = "pantry" | "recipes" | "saved";
type ButtonState = "idle" | "ready" | "loading";

// todo:
// button state: idle -> ready (after ingredient change) -> loading (after request) -> idle (after recipes load)
// recipe persistence between page changes (might have to lift everything regardless)

export function Dashboard() {
  const [page, setPage] = useState<Page>("pantry");
  const [buttonState, setButtonState] = useState<ButtonState>("idle");

  return (
    <div className="bg-background relative flex min-h-screen flex-col">
      {/* main page view */}
      {page === "pantry" ? (
        <Pantry />
      ) : page === "recipes" ? (
        <Recipes />
      ) : (
        <Saved />
      )}
      {/* navbar */}
      <div className="text-muted-foreground flex text-center font-medium outline">
        <motion.button
          onClick={() => setPage("pantry")}
          whileTap={{ scale: 0.9 }}
          className="m-auto flex-1 py-3"
        >
          <ShoppingBasket className="m-auto" size="2rem" />
          Pantry
        </motion.button>
        <div className="flex-1">
          <motion.img
            onClick={() => setPage("recipes")}
            whileTap={{ scale: 0.9 }}
            src="/logo.svg"
            draggable={false}
            className="absolute bottom-4 left-1/2 h-24 -translate-x-1/2 rounded-full outline"
          />
        </div>
        <motion.button
          onClick={() => setPage("saved")}
          whileTap={{ scale: 0.9 }}
          className="m-auto flex-1 py-3"
        >
          <Bookmark className="m-auto" size="2rem" />
          Saved
        </motion.button>
      </div>
    </div>
  );
}
