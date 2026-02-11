import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

// @ts-ignore
import "@fontsource-variable/inter";

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
