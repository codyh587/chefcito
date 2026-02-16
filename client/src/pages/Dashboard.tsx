import { useState } from "react";

import { Navbar } from "@/components/Navbar";
import { Pantry } from "@/components/Pantry";
import { Recipes } from "@/components/Recipes";
import { Saved } from "@/components/Saved";

export type Page = "pantry" | "recipes" | "saved";

export function Dashboard() {
  const [page, setPage] = useState<Page>("pantry");

  return (
    <div className="bg-background relative flex min-h-screen flex-col">
      {page === "pantry" ? (
        <Pantry />
      ) : page === "recipes" ? (
        <Recipes />
      ) : (
        <Saved />
      )}
      <Navbar setPage={setPage} />
    </div>
  );
}
