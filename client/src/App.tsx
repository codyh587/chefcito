import { AnimatePresence, motion } from "motion/react";

import { useFoodPreferences } from "@/contexts/FoodPreferencesContext";
import { Dashboard } from "@/pages/Dashboard";
import { Survey } from "@/pages/Survey";

export function App() {
  const { preferences } = useFoodPreferences();

  return (
    <div className="overflow-x-clip">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={preferences.surveyFinished ? "Dashboard" : "Survey"}
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: "spring", stiffness: 150, damping: 25 }}
        >
          {preferences.surveyFinished ? <Dashboard /> : <Survey />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
