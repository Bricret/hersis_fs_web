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
      <div className="flex items-center gap-2">
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
