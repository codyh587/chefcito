import { AnimatePresence, motion } from "motion/react";

import { useFoodPreferences } from "@/contexts/FoodPreferencesContext";
import { Dashboard } from "@/pages/Dashboard";
import { Survey } from "@/pages/Survey";

export function App() {
  const {
    preferences: { surveyFinished },
  } = useFoodPreferences();

  return (
    <div className="scrollbar-hide overflow-x-hidden select-none">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={surveyFinished ? "dashboard" : "survey"}
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: "spring", stiffness: 150, damping: 25 }}
        >
          {surveyFinished ? <Dashboard /> : <Survey />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
