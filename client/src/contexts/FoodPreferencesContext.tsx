import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const LOCAL_STORAGE_KEY = "chefcito_food_preferences";

export type FoodPreferences = {
  spiceLevel: string;
  mealType: string;
  protein: string;
  cuisine: string;
  sweetOrSavory: string;
  surveyFinished: boolean;
};

type FoodPreferencesContextType = {
  preferences: Partial<FoodPreferences>;
  updatePreferences: (updates: Partial<FoodPreferences>) => void;
  clearPreferences: () => void;
};

const FoodPreferencesContext = createContext<
  FoodPreferencesContextType | undefined
>(undefined);

export function FoodPreferencesProvider({ children }: { children: ReactNode }) {
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
      return { surveyFinished: false };
    },
  );

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error("Error saving preferences to cache:", error);
    }
  }, [preferences]);

  function updatePreferences(updates: Partial<FoodPreferences>) {
    setPreferences((prev) => ({
      ...prev,
      ...updates,
    }));
  }

  function clearPreferences() {
    setPreferences({ surveyFinished: false });
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing preferences from cache:", error);
    }
  }

  return (
    <FoodPreferencesContext.Provider
      value={{ preferences, updatePreferences, clearPreferences }}
    >
      {children}
    </FoodPreferencesContext.Provider>
  );
}

export function useFoodPreferences() {
  const context = useContext(FoodPreferencesContext);
  if (context === undefined) {
    throw new Error(
      "useFoodPreferences must be used within a FoodPreferencesProvider",
    );
  }
  return context;
}
