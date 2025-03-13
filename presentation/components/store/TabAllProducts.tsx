"use client";

import { Grid, List, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { productsData } from "@/core/data/sales/DataSales";

interface Props {
  selectedCategory: string;
  searchTerm: string;
  showProductDialog: (product: any) => void;
}

export const TabAllProducts = ({
  searchTerm,
  selectedCategory,
  showProductDialog,
}: Props) => {
  const filteredProducts = productsData.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <Tabs defaultValue="grid">
        <div className="flex justify-between">
          <TabsList className="bg-main-background-color/75 border border-stone-300 overflow-hidden shadow-sm gap-2">
            <TabsTrigger value="grid">
              <Grid
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Cuadrícula
            </TabsTrigger>
            <TabsTrigger value="list">
              <List
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Lista
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="grid" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
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
                        Stock: {product.stock} {product.unit}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="list" className="mt-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.code}
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {product.stock} {product.unit}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          showProductDialog(product);
                        }}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Agregar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
