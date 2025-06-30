"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  productId: number;
  product_type: "medicine" | "general";
  subtotal: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: any) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: any) => {
    setCart((prevCart) => {
      // Check if product already exists in cart
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        // Update quantity if product already in cart
        return prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: Number(((item.quantity + 1) * item.price).toFixed(2)),
              }
            : item
        );
      } else {
        // Add new product to cart
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: Number(product.price.toFixed(2)),
          quantity: 1,
          productId: Number(product.id),
          product_type:
            product.category === "medicine" ? "medicine" : "general",
          subtotal: Number(product.price.toFixed(2)),
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
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
              subtotal: Number((quantity * item.price).toFixed(2)),
            }
          : item
      )
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
