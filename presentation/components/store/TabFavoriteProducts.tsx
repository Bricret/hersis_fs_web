import { productsData, ProductType } from "@/core/data/sales/DataSales";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

interface Props {
  showProductDialog: (product: ProductType) => void;
  searchTerm: string;
  setSearchSuggestions: (suggestions: ProductType[]) => void;
  setShowSuggestions: (show: boolean) => void;
}

export default function TabFavoriteProducts({
  searchTerm,
  setSearchSuggestions,
  setShowSuggestions,
  showProductDialog,
}: Props) {
  const popularProducts = productsData.filter((product) => product.popular);

  // Actualizar sugerencias de búsqueda
  useEffect(() => {
    if (searchTerm.length > 1) {
      const suggestions = productsData
        .filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.code.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5);

      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
        {popularProducts.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden cursor-pointer hover:border-primary transition-colors"
            onClick={() => showProductDialog(product)}
          >
            <CardHeader className="p-4 pb-2">
              <CardTitle className="line-clamp-1 text-base">
                {product.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex flex-col gap-2">
                <Badge variant="outline">{product.category}</Badge>
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Stock: {product.stock}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
