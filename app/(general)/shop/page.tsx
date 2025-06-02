import PosSection from "@/presentation/components/shop/POS-Section";
import { getInventory } from "@/presentation/services/server/inventory.server";
import { CartProvider } from "@/presentation/store/cart-context";

export default async function POSPage() {
  const products = await getInventory();

  return (
    <CartProvider>
      <PosSection products={products.data} />
    </CartProvider>
  );
}
