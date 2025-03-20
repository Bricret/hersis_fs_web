import ModalToAddProduct from "@/presentation/components/store/ModalToAddProduct";
import ModalPayment from "@/presentation/components/store/ModalPayment";
import ModalToRecentSales from "@/presentation/components/store/ModalToRecentSales";
import type { ProductType, ItemsProps } from "@/core/data/sales/DataSales";
import { recentSales } from "@/core/data/sales/DataSales";

interface DialogsSectionProps {
  dialogStates: {
    product: boolean;
    payment: boolean;
    recentSales: boolean;
  };
  setDialogStates: React.Dispatch<
    React.SetStateAction<{
      product: boolean;
      payment: boolean;
      recentSales: boolean;
    }>
  >;
  selectedProduct: ProductType | null;
  cart: {
    addToCart: (
      product: ProductType,
      sellByUnit: boolean,
      quantity: number
    ) => void;
    calculateTotal: () => number;
    clearCart: () => void;
    //TODO: Cambiar el tipo de cart
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    setCart: (cart: any) => void;
  };
}

export const DialogsSection = ({
  dialogStates,
  setDialogStates,
  selectedProduct,
  cart,
}: DialogsSectionProps) => {
  const handleCompleteTransaction = (
    paymentMethod: string,
    amountPaid: number
  ) => {
    // Aquí iría la lógica para guardar la venta en la base de datos
    cart.clearCart();
    setDialogStates((prev) => ({ ...prev, payment: false }));
  };

  const handleRepeatSale = (items: ItemsProps[]) => {
    // Implementar la lógica para repetir una venta
    setDialogStates((prev) => ({ ...prev, recentSales: false }));
  };

  return (
    <>
      <ModalToAddProduct
        product={selectedProduct}
        open={dialogStates.product}
        onClose={() => setDialogStates((prev) => ({ ...prev, product: false }))}
        onAdd={cart.addToCart}
      />

      <ModalPayment
        open={dialogStates.payment}
        onClose={() => setDialogStates((prev) => ({ ...prev, payment: false }))}
        total={cart.calculateTotal() * 1.16}
        onComplete={handleCompleteTransaction}
      />

      <ModalToRecentSales
        open={dialogStates.recentSales}
        onClose={() =>
          setDialogStates((prev) => ({ ...prev, recentSales: false }))
        }
        sales={recentSales}
        onRepeatSale={handleRepeatSale}
      />
    </>
  );
};
