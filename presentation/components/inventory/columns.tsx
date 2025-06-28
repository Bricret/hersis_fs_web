"use client";

import { Badge } from "@/presentation/components/ui/badge";
import { ColumnDef, FilterFn, Row, SortDirection } from "@tanstack/react-table";

import { Button } from "@/presentation/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";

import { Checkbox } from "@/presentation/components/ui/checkbox";

import { toast } from "sonner";
import { Inventory } from "@/core/domain/entity/inventory.entity";
import {
  Bird,
  ChevronDownIcon,
  ChevronUpIcon,
  Ellipsis,
  Pill,
  Tablets,
} from "lucide-react";
import { format } from "@formkit/tempo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/presentation/components/ui/tooltip";
import { ProductDialog } from "./product-dialog";
import { RefillDialog } from "./refill-dialog";
import { UpdatePriceDialog } from "./update-price-dialog";
import { DeactivateProductDialog } from "./deactivate-product-dialog";

const myCustomFilterFn: FilterFn<Inventory> = (
  row: Row<Inventory>,
  columnId: string,
  filterValue: string,
  addMeta: (meta: any) => void
) => {
  filterValue = filterValue.toLowerCase();

  const filterParts = filterValue.split(" ");
  const rowValues = `${row.original.name} ${row.original.barCode} ${
    "category" in row.original ? row.original.category : ""
  }`.toLowerCase();

  return filterParts.every((part) => rowValues.includes(part));
};

const SortedIcon = ({ isSorted }: { isSorted: false | SortDirection }) => {
  if (isSorted === "asc") {
    return <ChevronUpIcon className="h-4 w-4" />;
  }

  if (isSorted === "desc") {
    return <ChevronDownIcon className="h-4 w-4" />;
  }

  return null;
};

export const columns: ColumnDef<Inventory>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <SortedIcon isSorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as boolean;

      return <div className="flex justify-center items-center">{name}</div>;
    },
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Estado
          <SortedIcon isSorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("is_active") as boolean;
      const variant = status ? "success" : "destructive";

      return (
        <div className="flex justify-center items-center">
          <Badge variant={variant} className="capitalize">
            {status ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "initial_quantity",
    filterFn: myCustomFilterFn,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cantidad
          <SortedIcon isSorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const quantity = row.getValue("initial_quantity") as number;

      // Definir los umbrales para los diferentes estados
      const criticalThreshold = 5;
      const lowThreshold = 15;

      // Determinar el estado del stock
      let stockStatus: "critical" | "low" | "good" = "good";
      let statusColor = "text-green-500";
      let statusMessage = "Stock adecuado";

      if (quantity <= criticalThreshold) {
        stockStatus = "critical";
        statusColor = "text-red-500";
        statusMessage = "Stock crítico";
      } else if (quantity <= lowThreshold) {
        stockStatus = "low";
        statusColor = "text-yellow-500";
        statusMessage = "Stock bajo";
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="w-full">
              <div
                className={`flex items-center justify-center gap-2 ${
                  stockStatus === "critical" ? "animate-pulse" : ""
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                <span className={`font-medium ${statusColor}`}>{quantity}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{statusMessage}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "sales_price",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Precio
            <SortedIcon isSorted={column.getIsSorted()} />
          </Button>
        </div>
      );
    },
    // header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("sales_price"));
      const formatted = new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
      }).format(amount);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "barCode",
    filterFn: myCustomFilterFn,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Codigo de barras
          <SortedIcon isSorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const barCode = row.getValue("barCode") as string;
      return <div className="text-center font-medium">{barCode}</div>;
    },
  },
  {
    accessorKey: "type",
    filterFn: myCustomFilterFn,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tipo de Producto
          <SortedIcon isSorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      if (type === "medicine") {
        return (
          <div className="flex justify-center items-center">
            <Badge
              variant="outline"
              className="bg-blue-200/50 border border-blue-400 text-blue-700"
            >
              <Tablets className="w-5 h-5 mr-1" />
              Medicina
            </Badge>
          </div>
        );
      }

      return (
        <div className="flex justify-center items-center">
          <Badge variant="success">
            <Bird className="w-5 h-5 mr-1" />
            General
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "expiration_date",
    filterFn: myCustomFilterFn,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Vencimiento
          <SortedIcon isSorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const expirationDateValue = row.getValue("expiration_date") as string;

      // Validar si la fecha es válida
      if (
        !expirationDateValue ||
        expirationDateValue === "" ||
        expirationDateValue === null
      ) {
        return (
          <div className="flex justify-center items-center">
            <Badge variant="outline" className="text-gray-500">
              Sin fecha
            </Badge>
          </div>
        );
      }

      // Intentar crear un objeto Date válido
      let date: Date;
      try {
        date = new Date(expirationDateValue);

        // Verificar si la fecha es válida
        if (isNaN(date.getTime())) {
          return (
            <div className="flex justify-center items-center">
              <Badge variant="outline" className="text-gray-500">
                Fecha inválida
              </Badge>
            </div>
          );
        }
      } catch (error) {
        return (
          <div className="flex justify-center items-center">
            <Badge variant="outline" className="text-gray-500">
              Error de fecha
            </Badge>
          </div>
        );
      }

      // Formatear la fecha de manera segura
      let formatted: string;
      try {
        formatted = format(date, "medium");
      } catch (error) {
        // Si el formateo falla, usar un formato básico
        formatted = date.toLocaleDateString("es-NI", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }

      const today = new Date();
      const diffTime = date.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let variant: "success" | "destructive" | "alert" = "success";
      let tooltipMessage = "";

      if (diffDays < 0) {
        variant = "destructive";
        tooltipMessage = `Caducado hace ${Math.abs(diffDays)} días`;
      } else if (diffDays === 0) {
        variant = "destructive";
        tooltipMessage = "Caduca hoy";
      } else if (diffDays <= 15) {
        variant = "alert";
        tooltipMessage = `Caduca en ${diffDays} días`;
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex justify-center items-center w-full">
              <Badge variant={variant} className="text-center">
                {formatted}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltipMessage || "Fecha válida"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <ProductDialog product={product} />
            <RefillDialog product={product} />
            <UpdatePriceDialog product={product} />
            <DropdownMenuSeparator />
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DeactivateProductDialog product={product} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
