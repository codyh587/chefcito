import { Button } from "@/components/ui/button";

export function Survey() {
  return (
    <div className="h-screen bg-linear-to-br from-red-600 via-yellow-400 to-green-600 flex-col overflow-y-auto p-10 text-center">
      <div className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance text-white text-shadow-lg">
        LUCHA SABOR
      </div>
      <Button variant="secondary" className="w-full" />
    </div>
  );
}
