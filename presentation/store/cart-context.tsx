"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  pricePerUnit: number;
  quantity: number;
  unitsPerBox: number;
  sellByUnit: boolean; // true = por unidad, false = por caja
  productId: number;
  product_type: "medicine" | "general";
  subtotal: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: any, sellByUnit?: boolean) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: any, sellByUnit: boolean = true) => {
    setCart((prevCart) => {
      // Check if product already exists in cart with the same sellByUnit option
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.sellByUnit === sellByUnit
      );

      if (existingItem) {
        // Update quantity if product already in cart with same option
        const newQuantity = existingItem.quantity + 1;
        const unitPrice = sellByUnit ? product.pricePerUnit : product.price;
        return prevCart.map((item) =>
          item.id === product.id && item.sellByUnit === sellByUnit
            ? {
                ...item,
                quantity: newQuantity,
                subtotal: Number((newQuantity * unitPrice).toFixed(2)),
              }
            : item
        );
      } else {
        // Add new product to cart
        const unitPrice = sellByUnit ? product.pricePerUnit : product.price;
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: Number(product.price.toFixed(2)),
          pricePerUnit: Number(product.pricePerUnit.toFixed(2)),
          quantity: 1,
          unitsPerBox: product.unitsPerBox || 1,
          sellByUnit: sellByUnit,
          productId: Number(product.id),
          product_type:
            product.category === "medicine" ? "medicine" : "general",
          subtotal: Number(unitPrice.toFixed(2)),
        };

        return [...prevCart, newItem];
      }
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          const unitPrice = item.sellByUnit ? item.pricePerUnit : item.price;
          return {
            ...item,
            quantity,
            subtotal: Number((quantity * unitPrice).toFixed(2)),
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return Number(
      cart.reduce((total, item) => total + item.subtotal, 0).toFixed(2)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
