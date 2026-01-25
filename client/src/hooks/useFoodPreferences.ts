import { useEffect, useState } from "react";

import type { FoodPreferences } from "../types/FoodPreferences";

const LOCAL_STORAGE_KEY = "chefcito_food_preferences";

export const useFoodPreferences = () => {
  // Initialize state from localStorage or use default values
  const [preferences, setPreferences] = useState<Partial<FoodPreferences>>(
    () => {
      try {
        const storedPreferences = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedPreferences) {
          return JSON.parse(storedPreferences);
        }
      } catch (error) {
        console.error("Error loading preferences from cache:", error);
      }
      return {};
    },
  );

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error("Error saving preferences to cache:", error);
    }
  }, [preferences]);

  const updatePreferences = (updates: Partial<FoodPreferences>) => {
    setPreferences((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const clearPreferences = () => {
    setPreferences({});
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing preferences from cache:", error);
    }
  };

  return {
    preferences,
    updatePreferences,
    setPreferences,
    clearPreferences,
  };
};
