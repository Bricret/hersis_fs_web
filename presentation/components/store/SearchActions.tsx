import { Button } from "@/presentation/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/presentation/components/ui/tooltip";
import { Barcode, Clock } from "lucide-react";

interface SearchActionsProps {
  barcodeMode: boolean;
  setBarcodeMode: (value: boolean) => void;
  setRecentSalesOpen: (value: boolean) => void;
}

export const SearchActions = ({
  barcodeMode,
  setBarcodeMode,
  setRecentSalesOpen,
}: SearchActionsProps) => {
  return (
    <div className="flex gap-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={barcodeMode ? "default" : "outline"}
              onClick={() => setBarcodeMode(!barcodeMode)}
            >
              <Barcode className="h-4 w-4" />
              Código de barras
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Modo código de barras (Ctrl+B)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={() => setRecentSalesOpen(true)}>
              <Clock className="h-4 w-4" />
              Historial de ventas
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ventas recientes</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
