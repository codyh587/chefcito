import { useFoodPreferences } from "@/contexts/FoodPreferencesContext";
import { Dashboard } from "@/pages/Dashboard";
import { Survey } from "@/pages/Survey";

export function App() {
  const { preferences } = useFoodPreferences();
  return !preferences.surveyFinished ? <Survey /> : <Dashboard />;
}
