"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/presentation/components/ui/avatar";
import { Badge } from "@/presentation/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/components/ui/table";

const salesData = [
  {
    id: "SALE001",
    customer: {
      name: "María García",
      email: "maria@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MG",
    },
    products: "Paracetamol 500mg (2), Ibuprofeno 400mg (1)",
    amount: "$28.50",
    status: "Completada",
    date: "Hace 10 minutos",
  },
  {
    id: "SALE002",
    customer: {
      name: "Juan Pérez",
      email: "juan@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JP",
    },
    products: "Amoxicilina 500mg (1)",
    amount: "$15.75",
    status: "Completada",
    date: "Hace 25 minutos",
  },
  {
    id: "SALE003",
    customer: {
      name: "Ana Martínez",
      email: "ana@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AM",
    },
    products: "Loratadina 10mg (1), Omeprazol 20mg (1)",
    amount: "$22.30",
    status: "Procesando",
    date: "Hace 45 minutos",
  },
  {
    id: "SALE004",
    customer: {
      name: "Carlos Rodríguez",
      email: "carlos@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "CR",
    },
    products: "Paracetamol 500mg (1)",
    amount: "$12.99",
    status: "Completada",
    date: "Hace 1 hora",
  },
  {
    id: "SALE005",
    customer: {
      name: "Laura Sánchez",
      email: "laura@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "LS",
    },
    products: "Ibuprofeno 400mg (2), Loratadina 10mg (1)",
    amount: "$32.45",
    status: "Completada",
    date: "Hace 2 horas",
  },
];

export function RecentSalesTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Productos</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Monto</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {salesData.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={sale.customer.avatar}
                    alt={sale.customer.name}
                  />
                  <AvatarFallback>{sale.customer.initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{sale.customer.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {sale.date}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell className="max-w-[200px] truncate">
              {sale.products}
            </TableCell>
            <TableCell>
              <Badge
                variant={sale.status === "Completada" ? "success" : "outline"}
              >
                {sale.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-medium">
              {sale.amount}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
