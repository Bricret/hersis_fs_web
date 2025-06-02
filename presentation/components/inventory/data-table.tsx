"use client";
import { useState } from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";

import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "../ui/pagination";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Columns2,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { ButtonBackgroundShine } from "../ui/button-bg-shine";
import {
  Inventory,
  InventoryState,
} from "@/core/domain/entity/inventory.entity";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [currentStatus, setCurrentStatus] = useState("all");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const isDeleteVisible = Object.keys(rowSelection).length > 0;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 5,
        pageIndex: 0,
      },
    },
  });

  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) pages.push(i);

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <main>
      <section className="flex items-center justify-between py-4">
        <article className="flex gap-x-4">
          <Input
            placeholder="Busca por nombre del producto o código de barras"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              setCurrentStatus("all");
              table.getColumn("name")?.setFilterValue(event.target.value);
              table.getColumn("barCode")?.setFilterValue(event.target.value);
            }}
            className="w-sm shadow-sm"
          />
          <Select
            value={currentStatus}
            onValueChange={(value) => {
              if (value === "all") {
                table.getColumn("state")?.setFilterValue(undefined);
                setCurrentStatus("all");
                return;
              }

              setCurrentStatus(value);
              table.getColumn("state")?.setFilterValue(value);
            }}
          >
            <SelectTrigger className="w-auto ml-2 bg-transparent border">
              <Filter size={16} />
              <SelectValue placeholder="Estado - Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Estado de los productos</SelectLabel>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value={InventoryState.ALTO}>Alto</SelectItem>
                <SelectItem value={InventoryState.MEDIO}>Medio</SelectItem>
                <SelectItem value={InventoryState.CRITICO}>Critico</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto bg-transparent border"
              >
                <Columns2 size={16} />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .filter((column) => column.id !== "actions")
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {isDeleteVisible && (
            <Button
              className="ml-2"
              variant="destructive"
              onClick={() => {
                const ids = table.getSelectedRowModel().rows.map((row) => {
                  return (row.original as Inventory).name;
                });

                console.log(ids);
              }}
            >
              Delete
            </Button>
          )}
        </article>
        <Link href="/inventory/registerProduct" passHref>
          <ButtonBackgroundShine className="bg-main-background-color">
            Agregar producto
          </ButtonBackgroundShine>
        </Link>
      </section>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-[#f9f9f9] hover:bg-[#f9f9f9]/90"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between gap-3 max-sm:flex-col py-4 px-6">
          <p className="text-sm text-muted-foreground">
            Mostrando {table.getRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} resultados
          </p>

          {/* Pagination buttons */}
          <div className="grow justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="bg-transparent border"
                  >
                    <ChevronLeftIcon size={16} />
                  </Button>
                </PaginationItem>

                {generatePageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <Button
                        size="icon"
                        variant={page === currentPage ? "outline" : "ghost"}
                        onClick={() =>
                          typeof page === "number" &&
                          table.setPageIndex(page - 1)
                        }
                        className="bg-transparent border  active:bg-transparent/90"
                      >
                        {page}
                      </Button>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="bg-transparent border "
                  >
                    <ChevronRightIcon size={16} />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          {/* Results per page */}
          <div className="justify-end">
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="w-[135px] bg-transparent border ">
                <SelectValue placeholder="Resultados por página" />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 25, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size} por página
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </main>
  );
}
