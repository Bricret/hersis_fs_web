import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { RecentSalesProps } from "@/core/data/sales/DataSales";

interface RecentSalesDialogProps {
  open: boolean;
  onClose: () => void;
  sales: RecentSalesProps[];
  onRepeatSale: (items: any[]) => void;
}

export default function ModalToRecentSales({
  open,
  onClose,
  sales,
  onRepeatSale,
}: RecentSalesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ventas recientes</DialogTitle>
          <DialogDescription>
            Historial de las últimas ventas realizadas
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[400px] overflow-y-auto">
          {sales.map((sale) => (
            <div key={sale.id} className="mb-4 rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <div className="font-medium">Venta #{sale.id}</div>
                  <div className="text-sm text-muted-foreground">
                    {sale.date.toLocaleTimeString()} - {sale.paymentMethod}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${sale.total.toFixed(2)}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onRepeatSale(sale.items);
                      onClose();
                    }}
                  >
                    Repetir venta
                  </Button>
                </div>
              </div>
              <Separator className="my-2" />
              <div className="space-y-1">
                {sale.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
