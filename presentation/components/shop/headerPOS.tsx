"use client";

import { Package2, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { Badge } from "@/presentation/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/presentation/components/ui/sheet";
import { useState } from "react";
import { useIsMobile } from "@/presentation/hooks/use-mobile";

interface HeaderProps {
  cartCount: number;
  onCartToggle: () => void;
  isCartOpen: boolean;
}

export default function Header({
  cartCount,
  onCartToggle,
  isCartOpen,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        {isMobile && (
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px]">
              <div className="py-4">
                <div className="flex items-center mb-6">
                  <Package2 className="h-6 w-6 text-emerald-600 mr-2" />
                  <h2 className="text-xl font-bold">FarmaRápida</h2>
                </div>
                <nav className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5 mr-3" />
                    Ventas
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Package2 className="h-5 w-5 mr-3" />
                    Inventario
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        )}

        <div className="flex items-center">
          <Package2 className="h-6 w-6 text-emerald-600 mr-2" />
          <h1 className="text-xl font-bold text-gray-800 hidden sm:inline">
            FarmaRápida
          </h1>
          <h1 className="text-xl font-bold text-gray-800 sm:hidden">FR</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-sm text-gray-500 hidden md:block">
          Cajero: <span className="font-medium text-gray-700">Carlos M.</span>
        </div>

        {isMobile && (
          <Button
            variant="outline"
            size="sm"
            className="relative"
            onClick={onCartToggle}
          >
            {isCartOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                    {cartCount}
                  </Badge>
                )}
              </>
            )}
          </Button>
        )}
      </div>
    </header>
  );
}
