import { useState } from "react";
import { toast } from "sonner";
import type { CartItem, ProductType } from "@/core/data/sales/DataSales";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (
    product: ProductType,
    sellByUnit = false,
    quantity = 1
  ) => {
    const price = sellByUnit ? product.pricePerUnit : product.price;

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.sellByUnit === sellByUnit
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id && item.sellByUnit === sellByUnit
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          price,
          pricePerUnit: product.pricePerUnit,
          quantity,
          unit: product.unit,
          unitsPerBox: product.unitsPerBox,
          sellByUnit,
        },
      ];
    });

    toast("Producto agregado", {
      description: `${product.name} agregado al carrito`,
      duration: 2000,
    });
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item, i) => (i === index ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal,
  };
};
