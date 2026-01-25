import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

import { useFoodPreferences } from "@/contexts/FoodPreferencesContext";

export function Dashboard() {
  const { clearPreferences } = useFoodPreferences();

  return (
    <motion.div
      key={2}
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="absolute inset-0 bg-blue-500 h-screen"
    >
      Dashboard
      <Button onClick={clearPreferences}>Reset</Button>
    </motion.div>
  );
}
