"use client";

import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/components/ui/table";

const inventoryData = [
  {
    id: "INV001",
    name: "Paracetamol 500mg",
    category: "Analgésicos",
    stock: 15,
    threshold: 20,
    unit: "Blister",
  },
  {
    id: "INV002",
    name: "Ibuprofeno 400mg",
    category: "Antiinflamatorios",
    stock: 8,
    threshold: 15,
    unit: "Blister",
  },
  {
    id: "INV003",
    name: "Amoxicilina 500mg",
    category: "Antibióticos",
    stock: 5,
    threshold: 10,
    unit: "Caja",
  },
  {
    id: "INV004",
    name: "Loratadina 10mg",
    category: "Antialérgicos",
    stock: 12,
    threshold: 20,
    unit: "Blister",
  },
  {
    id: "INV005",
    name: "Omeprazol 20mg",
    category: "Antiácidos",
    stock: 7,
    threshold: 15,
    unit: "Caja",
  },
];

export function InventoryTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inventoryData.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>
              {item.stock} {item.unit}
            </TableCell>
            <TableCell>
              <Badge variant={item.stock < 10 ? "destructive" : "secondary"}>
                {item.stock < 10 ? "Crítico" : "Bajo"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm">
                Reabastecer
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
