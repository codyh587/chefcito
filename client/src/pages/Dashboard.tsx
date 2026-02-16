import { useState } from "react";

import { Navbar } from "@/components/Navbar";
import { Pantry } from "@/components/Pantry";
import { Recipes } from "@/components/Recipes";
import { Saved } from "@/components/Saved";

export function Dashboard() {
  const [page, setPage] = useState<string>("pantry");

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
      <Navbar setPage={setPage} />
    </div>
  );
}
