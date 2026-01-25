import { Button } from "@/components/ui/button";

import { useFoodPreferences } from "@/contexts/FoodPreferencesContext";

export function Dashboard() {
  const { clearPreferences } = useFoodPreferences();

  return (
    <div className="relative h-full min-h-screen w-full bg-blue-500">
      Dashboard
      <Button onClick={clearPreferences}>Reset</Button>
    </div>
  );
}
