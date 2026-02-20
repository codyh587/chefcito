import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const LOCAL_STORAGE_KEY = "chefcito_food_preferences";

export type FoodPreferences = {
  allergens: string[];
  pastry: boolean;
  maxNumIngredients: number;
  maxCookTime: number;
  spice: number;
  proteinFilled: boolean;
  loose: boolean;
  surveyFinished: boolean;
  recipesReady: boolean;
};

type FoodPreferencesContextType = {
  preferences: Partial<FoodPreferences>;
  updatePreferences: (updates: Partial<FoodPreferences>) => void;
  clearPreferences: () => void;
};

const FoodPreferencesContext = createContext<
  FoodPreferencesContextType | undefined
>(undefined);

export function useFoodPreferences() {
  const context = useContext(FoodPreferencesContext);
  if (context === undefined) {
    throw new Error(
      "useFoodPreferences must be used within a FoodPreferencesProvider",
    );
  }
  return context;
}

export function FoodPreferencesProvider({ children }: PropsWithChildren) {
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
      return { surveyFinished: false, recipesReady: false };
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
    setPreferences({ surveyFinished: false, recipesReady: false });
  }

  return (
    <FoodPreferencesContext.Provider
      value={{ preferences, updatePreferences, clearPreferences }}
    >
      {children}
    </FoodPreferencesContext.Provider>
  );
}
