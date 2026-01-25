import { Button } from "@/components/ui/button";

import { useFoodPreferences } from "@/contexts/FoodPreferencesContext";

export function Dashboard() {
  const { clearPreferences } = useFoodPreferences();

  return (
    <div>
      Dashboard
      <Button onClick={clearPreferences}>Reset</Button>
    </div>
  );
}
