"use client";

import { Tabs, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs";
import { ShoppingCart, Stethoscope } from "lucide-react";

interface ModeToggleProps {
  currentMode: "cashier" | "pharmacist";
  onModeChange: (mode: "cashier" | "pharmacist") => void;
}

export default function ModeToggle({
  currentMode,
  onModeChange,
}: ModeToggleProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex justify-center">
      <Tabs
        defaultValue={currentMode}
        value={currentMode}
        onValueChange={(value) =>
          onModeChange(value as "cashier" | "pharmacist")
        }
        className="w-full max-w-md"
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger
            value="cashier"
            className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Modo Cajero
          </TabsTrigger>
          <TabsTrigger
            value="pharmacist"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            <Stethoscope className="h-4 w-4 mr-2" />
            Modo Farmacéutico
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
