"use client";

import { useState } from "react";
import {
  Calendar,
  ChevronDown,
  Download,
  FileText,
  Filter,
  Info,
  Loader2,
  Package,
  RefreshCcw,
  Search,
  ShoppingCart,
  User,
  Users,
} from "lucide-react";

import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import { Calendar as CalendarComponent } from "@/presentation/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/components/ui/popover";
import { ScrollArea } from "@/presentation/components/ui/scroll-area";
import { Separator } from "@/presentation/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/components/ui/table";
import { toast } from "sonner";
import { Header } from "@/presentation/components/common/Header";
import { normalizeText } from "@/infraestructure/lib/utils";

// Tipos de datos
type EventType =
  | "venta"
  | "login"
  | "registro_producto"
  | "modificacion"
  | "pedido";

interface SystemEvent {
  id: string;
  timestamp: string;
  eventType: EventType;
  user: {
    id: string;
    name: string;
    role: string;
  };
  details: string;
  metadata: Record<string, any>;
}

// Datos de ejemplo para eventos del sistema
const generateSampleEvents = (): SystemEvent[] => {
  const events: SystemEvent[] = [];

  // Ventas
  events.push({
    id: "EVT001",
    timestamp: "2025-03-16T10:30:45",
    eventType: "venta",
    user: {
      id: "USR001",
      name: "María García",
      role: "Vendedor",
    },
    details: "Venta completada - Factura #F12345",
    metadata: {
      invoiceId: "F12345",
      items: [
        { name: "Paracetamol 500mg", quantity: 2, price: 5.99 },
        { name: "Ibuprofeno 400mg", quantity: 1, price: 6.5 },
      ],
      total: 18.48,
      paymentMethod: "Efectivo",
      customer: "Cliente general",
    },
  });

  events.push({
    id: "EVT002",
    timestamp: "2025-03-16T11:45:22",
    eventType: "venta",
    user: {
      id: "USR002",
      name: "Juan Pérez",
      role: "Vendedor",
    },
    details: "Venta completada - Factura #F12346",
    metadata: {
      invoiceId: "F12346",
      items: [
        { name: "Amoxicilina 500mg", quantity: 1, price: 15.75 },
        { name: "Vitamina C 500mg", quantity: 1, price: 12.5 },
      ],
      total: 28.25,
      paymentMethod: "Tarjeta",
      customer: "Ana Martínez",
    },
  });

  // Logins
  events.push({
    id: "EVT003",
    timestamp: "2025-03-16T08:15:10",
    eventType: "login",
    user: {
      id: "USR001",
      name: "María García",
      role: "Vendedor",
    },
    details: "Inicio de sesión exitoso",
    metadata: {
      ipAddress: "192.168.1.45",
      device: "Windows / Chrome",
      location: "Sucursal Principal",
    },
  });

  events.push({
    id: "EVT004",
    timestamp: "2025-03-16T08:30:05",
    eventType: "login",
    user: {
      id: "USR003",
      name: "Carlos Rodríguez",
      role: "Administrador",
    },
    details: "Inicio de sesión exitoso",
    metadata: {
      ipAddress: "192.168.1.50",
      device: "MacOS / Safari",
      location: "Remoto",
    },
  });

  // Registro de productos
  events.push({
    id: "EVT005",
    timestamp: "2025-03-15T14:20:30",
    eventType: "registro_producto",
    user: {
      id: "USR004",
      name: "Laura Sánchez",
      role: "Inventario",
    },
    details: "Nuevo producto registrado: Cetirizina 10mg",
    metadata: {
      productId: "PROD007",
      productName: "Cetirizina 10mg",
      category: "Antialérgicos",
      price: 6.75,
      stock: 110,
      supplier: "Laboratorios Médicos",
    },
  });

  // Modificaciones
  events.push({
    id: "EVT006",
    timestamp: "2025-03-15T16:45:12",
    eventType: "modificacion",
    user: {
      id: "USR003",
      name: "Carlos Rodríguez",
      role: "Administrador",
    },
    details: "Modificación de producto: Paracetamol 500mg",
    metadata: {
      productId: "PROD001",
      productName: "Paracetamol 500mg",
      changes: {
        price: {
          before: 5.5,
          after: 5.99,
        },
        stock: {
          before: 120,
          after: 150,
        },
      },
    },
  });

  events.push({
    id: "EVT007",
    timestamp: "2025-03-15T17:10:45",
    eventType: "modificacion",
    user: {
      id: "USR003",
      name: "Carlos Rodríguez",
      role: "Administrador",
    },
    details: "Modificación de usuario: Juan Pérez",
    metadata: {
      userId: "USR002",
      userName: "Juan Pérez",
      changes: {
        role: {
          before: "Asistente",
          after: "Vendedor",
        },
        branch: {
          before: "Sucursal Sur",
          after: "Sucursal Norte",
        },
      },
    },
  });

  // Pedidos
  events.push({
    id: "EVT008",
    timestamp: "2025-03-14T09:30:15",
    eventType: "pedido",
    user: {
      id: "USR004",
      name: "Laura Sánchez",
      role: "Inventario",
    },
    details: "Nuevo pedido a proveedor: Farmacéutica Nacional",
    metadata: {
      orderId: "ORD001",
      supplier: "Farmacéutica Nacional",
      items: [
        { name: "Paracetamol 500mg", quantity: 50, price: 4.5 },
        { name: "Aspirina 100mg", quantity: 30, price: 3.75 },
      ],
      total: 337.5,
      estimatedDelivery: "2025-03-20",
    },
  });

  events.push({
    id: "EVT009",
    timestamp: "2025-03-16T09:15:30",
    eventType: "venta",
    user: {
      id: "USR002",
      name: "Juan Pérez",
      role: "Vendedor",
    },
    details: "Venta completada - Factura #F12347",
    metadata: {
      invoiceId: "F12347",
      items: [
        { name: "Loratadina 10mg", quantity: 1, price: 7.25 },
        { name: "Jabón Antibacterial", quantity: 2, price: 3.99 },
      ],
      total: 15.23,
      paymentMethod: "Efectivo",
      customer: "Cliente general",
    },
  });

  events.push({
    id: "EVT010",
    timestamp: "2025-03-16T12:05:18",
    eventType: "login",
    user: {
      id: "USR005",
      name: "Roberto Gómez",
      role: "Farmacéutico",
    },
    details: "Inicio de sesión exitoso",
    metadata: {
      ipAddress: "192.168.1.60",
      device: "Android / Chrome",
      location: "Sucursal Norte",
    },
  });

  events.push({
    id: "EVT011",
    timestamp: "2025-03-15T10:40:22",
    eventType: "registro_producto",
    user: {
      id: "USR004",
      name: "Laura Sánchez",
      role: "Inventario",
    },
    details: "Nuevo producto registrado: Diclofenaco 50mg",
    metadata: {
      productId: "PROD008",
      productName: "Diclofenaco 50mg",
      category: "Antiinflamatorios",
      price: 7.75,
      stock: 110,
      supplier: "MediPharma",
    },
  });

  events.push({
    id: "EVT012",
    timestamp: "2025-03-14T11:25:40",
    eventType: "pedido",
    user: {
      id: "USR004",
      name: "Laura Sánchez",
      role: "Inventario",
    },
    details: "Nuevo pedido a proveedor: MediPharma",
    metadata: {
      orderId: "ORD002",
      supplier: "MediPharma",
      items: [
        { name: "Ibuprofeno 400mg", quantity: 40, price: 5.25 },
        { name: "Loratadina 10mg", quantity: 25, price: 6.0 },
      ],
      total: 360.0,
      estimatedDelivery: "2025-03-19",
    },
  });

  events.push({
    id: "EVT013",
    timestamp: "2025-03-15T15:50:33",
    eventType: "modificacion",
    user: {
      id: "USR003",
      name: "Carlos Rodríguez",
      role: "Administrador",
    },
    details: "Modificación de producto: Amoxicilina 500mg",
    metadata: {
      productId: "PROD003",
      productName: "Amoxicilina 500mg",
      changes: {
        price: {
          before: 14.5,
          after: 15.75,
        },
        supplier: {
          before: "Distribuidora Farmacéutica",
          after: "Laboratorios Médicos",
        },
      },
    },
  });

  events.push({
    id: "EVT014",
    timestamp: "2025-03-16T13:10:05",
    eventType: "venta",
    user: {
      id: "USR001",
      name: "María García",
      role: "Vendedor",
    },
    details: "Venta completada - Factura #F12348",
    metadata: {
      invoiceId: "F12348",
      items: [
        { name: "Omeprazol 20mg", quantity: 1, price: 9.99 },
        { name: "Vitamina C 500mg", quantity: 1, price: 12.5 },
      ],
      total: 22.49,
      paymentMethod: "Tarjeta",
      customer: "Miguel Torres",
    },
  });

  events.push({
    id: "EVT015",
    timestamp: "2025-03-14T14:35:27",
    eventType: "modificacion",
    user: {
      id: "USR003",
      name: "Carlos Rodríguez",
      role: "Administrador",
    },
    details: "Modificación de usuario: Laura Sánchez",
    metadata: {
      userId: "USR004",
      userName: "Laura Sánchez",
      changes: {
        permissions: {
          before: ["inventory_view", "inventory_edit"],
          after: ["inventory_view", "inventory_edit", "order_create"],
        },
      },
    },
  });

  // Ordenar eventos por timestamp (más reciente primero)
  return events.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

const sampleEvents = generateSampleEvents();

// Componente para mostrar detalles de un evento
function EventDetailsDialog({
  event,
  open,
  onClose,
}: {
  event: SystemEvent | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!event) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      dateStyle: "long",
      timeStyle: "medium",
    }).format(date);
  };

  // Renderizar contenido específico según el tipo de evento
  const renderEventSpecificContent = () => {
    switch (event.eventType) {
      case "venta":
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Detalles de la venta</h4>
              <div className="mt-1 rounded-md bg-muted p-3">
                <div className="flex justify-between text-sm">
                  <span>Factura:</span>
                  <span className="font-medium">
                    {event.metadata.invoiceId}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cliente:</span>
                  <span>{event.metadata.customer}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Método de pago:</span>
                  <span>{event.metadata.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total:</span>
                  <span className="font-medium">
                    ${event.metadata.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">Productos</h4>
              <div className="mt-1">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead className="text-right">Precio</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {event.metadata.items.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${(item.quantity * item.price).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        );

      case "login":
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Información de acceso</h4>
              <div className="mt-1 rounded-md bg-muted p-3">
                <div className="flex justify-between text-sm">
                  <span>Dirección IP:</span>
                  <span>{event.metadata.ipAddress}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Dispositivo:</span>
                  <span>{event.metadata.device}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Ubicación:</span>
                  <span>{event.metadata.location}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "registro_producto":
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Detalles del producto</h4>
              <div className="mt-1 rounded-md bg-muted p-3">
                <div className="flex justify-between text-sm">
                  <span>ID del producto:</span>
                  <span>{event.metadata.productId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Nombre:</span>
                  <span>{event.metadata.productName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Categoría:</span>
                  <span>{event.metadata.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Precio:</span>
                  <span>${event.metadata.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Stock inicial:</span>
                  <span>{event.metadata.stock} unidades</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Proveedor:</span>
                  <span>{event.metadata.supplier}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "modificacion":
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Cambios realizados</h4>
              <div className="mt-1">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campo</TableHead>
                      <TableHead>Valor anterior</TableHead>
                      <TableHead>Nuevo valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(event.metadata.changes).map(
                      ([field, values]: [string, any]) => (
                        <TableRow key={field}>
                          <TableCell className="font-medium capitalize">
                            {field}
                          </TableCell>
                          <TableCell>
                            {Array.isArray(values.before)
                              ? values.before.join(", ")
                              : typeof values.before === "number"
                              ? field.toLowerCase().includes("price")
                                ? `$${values.before.toFixed(2)}`
                                : values.before
                              : values.before}
                          </TableCell>
                          <TableCell>
                            {Array.isArray(values.after)
                              ? values.after.join(", ")
                              : typeof values.after === "number"
                              ? field.toLowerCase().includes("price")
                                ? `$${values.after.toFixed(2)}`
                                : values.after
                              : values.after}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        );

      case "pedido":
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Detalles del pedido</h4>
              <div className="mt-1 rounded-md bg-muted p-3">
                <div className="flex justify-between text-sm">
                  <span>ID del pedido:</span>
                  <span>{event.metadata.orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Proveedor:</span>
                  <span>{event.metadata.supplier}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total:</span>
                  <span className="font-medium">
                    ${event.metadata.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Entrega estimada:</span>
                  <span>
                    {new Date(
                      event.metadata.estimatedDelivery
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">Productos solicitados</h4>
              <div className="mt-1">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead className="text-right">
                        Precio unitario
                      </TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {event.metadata.items.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${(item.quantity * item.price).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-sm text-muted-foreground">
            No hay detalles adicionales disponibles para este evento.
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalles del evento</DialogTitle>
          <DialogDescription>
            Información completa del evento registrado en el sistema
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">{event.details}</h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(event.timestamp)}
              </p>
            </div>
            <Badge
              variant="outline"
              className={
                event.eventType === "venta"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : event.eventType === "login"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : event.eventType === "registro_producto"
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : event.eventType === "modificacion"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-indigo-50 text-indigo-700 border-indigo-200"
              }
            >
              {event.eventType === "venta"
                ? "Venta"
                : event.eventType === "login"
                ? "Inicio de sesión"
                : event.eventType === "registro_producto"
                ? "Registro de producto"
                : event.eventType === "modificacion"
                ? "Modificación"
                : "Pedido"}
            </Badge>
          </div>

          <div className="rounded-md bg-muted/50 p-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-background p-1">
                <User className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium">{event.user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {event.user.role}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {renderEventSpecificContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Componente principal
export default function ReportesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isExporting, setIsExporting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SystemEvent | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  // Obtener usuarios únicos para el filtro
  const uniqueUsers = Array.from(
    new Set(sampleEvents.map((event) => event.user.id))
  ).map((userId) => {
    const event = sampleEvents.find((e) => e.user.id === userId);
    return {
      id: userId,
      name: event?.user.name || "",
      role: event?.user.role || "",
    };
  });

  // Filtrar eventos según los criterios seleccionados
  const filteredEvents = sampleEvents.filter((event) => {
    // Filtro por término de búsqueda
    const matchesSearch =
      searchTerm === "" ||
      normalizeText(event.details).includes(normalizeText(searchTerm)) ||
      normalizeText(event.user.name).includes(normalizeText(searchTerm)) ||
      (event.metadata.invoiceId &&
        normalizeText(event.metadata.invoiceId).includes(
          normalizeText(searchTerm)
        )) ||
      (event.metadata.productName &&
        normalizeText(event.metadata.productName).includes(
          normalizeText(searchTerm)
        )) ||
      (event.metadata.orderId &&
        normalizeText(event.metadata.orderId).includes(
          normalizeText(searchTerm)
        ));

    // Filtro por tipo de evento
    const matchesEventType =
      selectedEventTypes.length === 0 ||
      selectedEventTypes.includes(event.eventType);

    // Filtro por usuario
    const matchesUser =
      selectedUsers.length === 0 || selectedUsers.includes(event.user.id);

    // Filtro por rango de fechas
    const eventDate = new Date(event.timestamp);
    const matchesDateFrom = !dateRange.from || eventDate >= dateRange.from;
    const matchesDateTo =
      !dateRange.to ||
      eventDate <= new Date(dateRange.to.setHours(23, 59, 59, 999));

    return (
      matchesSearch &&
      matchesEventType &&
      matchesUser &&
      matchesDateFrom &&
      matchesDateTo
    );
  });

  // Función para exportar reportes
  const handleExport = () => {
    setIsExporting(true);

    // Simulamos la exportación
    setTimeout(() => {
      setIsExporting(false);
      toast("Reporte exportado", {
        description: `Se ha generado un reporte con ${filteredEvents.length} eventos`,
      });
    }, 2000);
  };

  // Función para mostrar detalles de un evento
  const showEventDetailsDialog = (event: SystemEvent) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  // Función para formatear la fecha y hora
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Función para obtener el icono según el tipo de evento
  const getEventIcon = (eventType: EventType) => {
    switch (eventType) {
      case "venta":
        return <ShoppingCart className="h-4 w-4 text-green-500" />;
      case "login":
        return <User className="h-4 w-4 text-blue-500" />;
      case "registro_producto":
        return <Package className="h-4 w-4 text-purple-500" />;
      case "modificacion":
        return <RefreshCcw className="h-4 w-4 text-amber-500" />;
      case "pedido":
        return <FileText className="h-4 w-4 text-indigo-500" />;
    }
  };

  // Función para obtener el nombre del tipo de evento
  const getEventTypeName = (eventType: EventType) => {
    switch (eventType) {
      case "venta":
        return "Venta";
      case "login":
        return "Inicio de sesión";
      case "registro_producto":
        return "Registro de producto";
      case "modificacion":
        return "Modificación";
      case "pedido":
        return "Pedido";
    }
  };

  // Función para obtener el color de la badge según el tipo de evento
  const getEventBadgeVariant = (eventType: EventType) => {
    switch (eventType) {
      case "venta":
        return "bg-green-50 text-green-700 border-green-200";
      case "login":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "registro_producto":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "modificacion":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "pedido":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          title="Registro de eventos"
          subTitle="Consulte el historial de eventos y acciones realizadas en el sistema"
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Filtros</CardTitle>
                    <CardDescription>
                      Utilice los filtros para encontrar eventos específicos
                    </CardDescription>
                  </div>
                  <Button
                    onClick={handleExport}
                    disabled={isExporting || filteredEvents.length === 0}
                    className="gap-2"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Exportando...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Exportar reporte
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Buscar</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        type="search"
                        placeholder="Buscar en eventos..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de evento</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {selectedEventTypes.length === 0
                            ? "Todos los eventos"
                            : `${selectedEventTypes.length} seleccionados`}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Tipos de eventos</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                          checked={selectedEventTypes.includes("venta")}
                          onCheckedChange={(checked) => {
                            setSelectedEventTypes((prev) =>
                              checked
                                ? [...prev, "venta"]
                                : prev.filter((type) => type !== "venta")
                            );
                          }}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4 text-green-500" />
                          Ventas
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={selectedEventTypes.includes("login")}
                          onCheckedChange={(checked) => {
                            setSelectedEventTypes((prev) =>
                              checked
                                ? [...prev, "login"]
                                : prev.filter((type) => type !== "login")
                            );
                          }}
                        >
                          <User className="mr-2 h-4 w-4 text-blue-500" />
                          Inicios de sesión
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={selectedEventTypes.includes(
                            "registro_producto"
                          )}
                          onCheckedChange={(checked) => {
                            setSelectedEventTypes((prev) =>
                              checked
                                ? [...prev, "registro_producto"]
                                : prev.filter(
                                    (type) => type !== "registro_producto"
                                  )
                            );
                          }}
                        >
                          <Package className="mr-2 h-4 w-4 text-purple-500" />
                          Registros de productos
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={selectedEventTypes.includes("modificacion")}
                          onCheckedChange={(checked) => {
                            setSelectedEventTypes((prev) =>
                              checked
                                ? [...prev, "modificacion"]
                                : prev.filter((type) => type !== "modificacion")
                            );
                          }}
                        >
                          <RefreshCcw className="mr-2 h-4 w-4 text-amber-500" />
                          Modificaciones
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={selectedEventTypes.includes("pedido")}
                          onCheckedChange={(checked) => {
                            setSelectedEventTypes((prev) =>
                              checked
                                ? [...prev, "pedido"]
                                : prev.filter((type) => type !== "pedido")
                            );
                          }}
                        >
                          <FileText className="mr-2 h-4 w-4 text-indigo-500" />
                          Pedidos
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2">
                    <Label>Usuario</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {selectedUsers.length === 0
                            ? "Todos los usuarios"
                            : `${selectedUsers.length} seleccionados`}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Usuarios</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {uniqueUsers.map((user) => (
                          <DropdownMenuCheckboxItem
                            key={user.id}
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={(checked) => {
                              setSelectedUsers((prev) =>
                                checked
                                  ? [...prev, user.id]
                                  : prev.filter((id) => id !== user.id)
                              );
                            }}
                          >
                            <Users className="mr-2 h-4 w-4" />
                            {user.name}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2">
                    <Label>Rango de fechas</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {dateRange.from ? (
                              dateRange.to ? (
                                <>
                                  {dateRange.from.toLocaleDateString()} -{" "}
                                  {dateRange.to.toLocaleDateString()}
                                </>
                              ) : (
                                dateRange.from.toLocaleDateString()
                              )
                            ) : (
                              "Seleccionar fechas"
                            )}
                          </div>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="range"
                          selected={{
                            from: dateRange.from ?? undefined,
                            to: dateRange.to ?? undefined,
                          }}
                          onSelect={(range) => {
                            if (range) {
                              setDateRange({ from: range.from, to: range.to });
                            } else {
                              setDateRange({});
                            }
                          }}
                          numberOfMonths={2}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Eventos del sistema</CardTitle>
                  <CardDescription>
                    {filteredEvents.length} eventos encontrados
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedEventTypes([]);
                    setSelectedUsers([]);
                    setDateRange({});
                  }}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Limpiar filtros
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha y hora</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEvents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No se encontraron eventos con los filtros
                            seleccionados
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredEvents.map((event) => (
                          <TableRow key={event.id}>
                            <TableCell className="font-mono text-xs">
                              {formatDateTime(event.timestamp)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={getEventBadgeVariant(
                                  event.eventType
                                )}
                              >
                                <div className="flex items-center gap-1">
                                  {getEventIcon(event.eventType)}
                                  <span>
                                    {getEventTypeName(event.eventType)}
                                  </span>
                                </div>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="font-medium">
                                  {event.user.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  ({event.user.role})
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{event.details}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => showEventDetailsDialog(event)}
                              >
                                <Info className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      {/* Diálogo de detalles del evento */}
      <EventDetailsDialog
        event={selectedEvent}
        open={showEventDetails}
        onClose={() => setShowEventDetails(false)}
      />
    </div>
  );
}
