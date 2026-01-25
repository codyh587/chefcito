import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { App } from "@/App.tsx";
import { FoodPreferencesProvider } from "@/contexts/FoodPreferencesContext";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FoodPreferencesProvider>
      <App />
    </FoodPreferencesProvider>
  </StrictMode>,
);
