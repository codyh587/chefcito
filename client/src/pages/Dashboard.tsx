import { useState } from "react";

import { Bookmark, ChefHat, ShoppingBasket } from "lucide-react";

import { Pantry } from "@/components/Pantry";
import { Recipes } from "@/components/Recipes";
import { Saved } from "@/components/Saved";

type Page = "pantry" | "recipes" | "saved";

export function Dashboard() {
  const [page, setPage] = useState<Page>("pantry");

  return (
    <div className="bg-background relative flex h-full min-h-screen w-full flex-col">
      {page === "pantry" ? (
        <Pantry />
      ) : page === "recipes" ? (
        <Recipes />
      ) : page === "saved" ? (
        <Saved />
      ) : null}
      {/* navbar */}
      <div className="flex h-fit py-3 outline">
        <button
          onClick={() => setPage("pantry")}
          className="text-muted-foreground m-auto block flex-1 text-center font-medium outline-none"
        >
          <ShoppingBasket className="m-auto" size="2rem" />
          Pantry
        </button>
        <button
          onClick={() => setPage("recipes")}
          className="text-muted-foreground m-auto block flex-1 text-center font-medium outline-none"
        >
          <ChefHat className="m-auto" size="2rem" />
          Recipes
        </button>
        <button
          onClick={() => setPage("saved")}
          className="text-muted-foreground m-auto block flex-1 text-center font-medium outline-none"
        >
          <Bookmark className="m-auto" size="2rem" />
          Saved
        </button>
      </div>
    </div>
  );
}
