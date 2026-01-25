import { AnimatePresence } from "motion/react";

import { useFoodPreferences } from "@/contexts/FoodPreferencesContext";
import { Dashboard } from "@/pages/Dashboard";
import { Survey } from "@/pages/Survey";

export function App() {
  const { preferences } = useFoodPreferences();
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="sync">
        {!preferences.surveyFinished ? <Survey /> : <Dashboard />}
      </AnimatePresence>
    </div>
  );
}
