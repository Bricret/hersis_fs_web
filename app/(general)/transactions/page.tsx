"use client";

import { useState } from "react";
import {
  ArrowUp,
  Building,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  CreditCard,
  Download,
  Eye,
  Filter,
  Loader2,
  MoreHorizontal,
  Package,
  Plus,
  Receipt,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/presentation/components/ui/avatar";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Progress } from "@/presentation/components/ui/progress";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/presentation/components/ui/radio-group";
import { ScrollArea } from "@/presentation/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/presentation/components/ui/tabs";
import { Textarea } from "@/presentation/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/presentation/components/ui/alert-dialog";
import { toast } from "sonner";
import { Header } from "@/presentation/components/common/Header";
import { cn } from "@/infraestructure/lib/utils";
import { normalizeText } from "@/infraestructure/lib/utils";
// Tipos de datos
type TransactionStatus = "pagado" | "pendiente" | "cancelado";
type TransactionType = "pedido" | "gasto";
type ExpenseCategory =
  | "servicios"
  | "alquiler"
  | "salarios"
  | "marketing"
  | "mantenimiento"
  | "suministros"
  | "impuestos"
  | "otros";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Transaction {
  id: string;
  type: TransactionType;
  date: string;
  paymentDeadline: string;
  status: TransactionStatus;
  total: number;
  notes?: string;

  // Campos específicos para pedidos
  supplier?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  items?: OrderItem[];
  affectsInventory?: boolean;

  // Campos específicos para gastos
  expenseCategory?: ExpenseCategory;
  paymentMethod?: string;
  recipient?: string;
  reference?: string;
}

// Datos de ejemplo para proveedores
const suppliers = [
  {
    id: "SUP001",
    name: "Farmacéutica Nacional",
    email: "ventas@farmaceuticanacional.com",
    phone: "555-123-4567",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "SUP002",
    name: "MediPharma",
    email: "pedidos@medipharma.com",
    phone: "555-987-6543",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "SUP003",
    name: "Laboratorios Médicos",
    email: "ventas@labmedicos.com",
    phone: "555-456-7890",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "SUP004",
    name: "Distribuidora Farmacéutica",
    email: "info@distrifarm.com",
    phone: "555-789-0123",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "SUP005",
    name: "Importadora Médica",
    email: "contacto@importmed.com",
    phone: "555-234-5678",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

// Datos de ejemplo para productos
const products = [
  {
    id: "PROD001",
    name: "Paracetamol 500mg",
    price: 5.99,
    stock: 150,
  },
  {
    id: "PROD002",
    name: "Ibuprofeno 400mg",
    price: 6.5,
    stock: 85,
  },
  {
    id: "PROD003",
    name: "Amoxicilina 500mg",
    price: 15.75,
    stock: 45,
  },
  {
    id: "PROD004",
    name: "Loratadina 10mg",
    price: 7.25,
    stock: 120,
  },
  {
    id: "PROD005",
    name: "Omeprazol 20mg",
    price: 9.99,
    stock: 75,
  },
  {
    id: "PROD006",
    name: "Aspirina 100mg",
    price: 4.5,
    stock: 200,
  },
  {
    id: "PROD007",
    name: "Cetirizina 10mg",
    price: 8.25,
    stock: 90,
  },
  {
    id: "PROD008",
    name: "Diclofenaco 50mg",
    price: 7.75,
    stock: 110,
  },
];

// Categorías de gastos
const expenseCategories = [
  { id: "servicios", name: "Servicios públicos" },
  { id: "alquiler", name: "Alquiler" },
  { id: "salarios", name: "Salarios" },
  { id: "marketing", name: "Marketing y publicidad" },
  { id: "mantenimiento", name: "Mantenimiento" },
  { id: "suministros", name: "Suministros de oficina" },
  { id: "impuestos", name: "Impuestos" },
  { id: "otros", name: "Otros gastos" },
];

// Métodos de pago
const paymentMethods = [
  { id: "efectivo", name: "Efectivo" },
  { id: "tarjeta", name: "Tarjeta de crédito/débito" },
  { id: "transferencia", name: "Transferencia bancaria" },
  { id: "cheque", name: "Cheque" },
];

// Datos de ejemplo para transacciones
const generateSampleTransactions = (): Transaction[] => {
  const today = new Date();

  // Función para generar fechas relativas a hoy
  const getRelativeDate = (daysDiff: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + daysDiff);
    return date.toISOString().split("T")[0];
  };

  return [
    // Pedidos a proveedores
    {
      id: "TRX001",
      type: "pedido",
      date: getRelativeDate(-15),
      paymentDeadline: getRelativeDate(15),
      status: "pendiente",
      supplier: suppliers[0],
      items: [
        { id: "PROD001", name: "Paracetamol 500mg", quantity: 50, price: 5.99 },
        {
          id: "PROD003",
          name: "Amoxicilina 500mg",
          quantity: 20,
          price: 15.75,
        },
      ],
      total: 614.5,
      notes: "Entrega en almacén principal.",
      affectsInventory: true,
    },
    {
      id: "TRX002",
      type: "pedido",
      date: getRelativeDate(-25),
      paymentDeadline: getRelativeDate(5),
      status: "pendiente",
      supplier: suppliers[1],
      items: [
        { id: "PROD002", name: "Ibuprofeno 400mg", quantity: 30, price: 6.5 },
        { id: "PROD004", name: "Loratadina 10mg", quantity: 25, price: 7.25 },
        { id: "PROD005", name: "Omeprazol 20mg", quantity: 15, price: 9.99 },
      ],
      total: 544.35,
      notes: "Pedido urgente para reposición de stock.",
      affectsInventory: true,
    },
    {
      id: "TRX003",
      type: "pedido",
      date: getRelativeDate(-5),
      paymentDeadline: getRelativeDate(25),
      status: "pendiente",
      supplier: suppliers[2],
      items: [
        { id: "PROD006", name: "Aspirina 100mg", quantity: 100, price: 4.5 },
        { id: "PROD007", name: "Cetirizina 10mg", quantity: 40, price: 8.25 },
      ],
      total: 780.0,
      notes: "Confirmar disponibilidad antes de enviar.",
      affectsInventory: true,
    },
    {
      id: "TRX004",
      type: "pedido",
      date: getRelativeDate(-30),
      paymentDeadline: getRelativeDate(0),
      status: "pagado",
      supplier: suppliers[3],
      items: [
        { id: "PROD001", name: "Paracetamol 500mg", quantity: 40, price: 5.99 },
        { id: "PROD008", name: "Diclofenaco 50mg", quantity: 35, price: 7.75 },
      ],
      total: 511.05,
      notes: "Pago realizado por transferencia bancaria.",
      affectsInventory: true,
    },
    {
      id: "TRX005",
      type: "pedido",
      date: getRelativeDate(-40),
      paymentDeadline: getRelativeDate(-10),
      status: "cancelado",
      supplier: suppliers[4],
      items: [
        {
          id: "PROD003",
          name: "Amoxicilina 500mg",
          quantity: 30,
          price: 15.75,
        },
        { id: "PROD005", name: "Omeprazol 20mg", quantity: 25, price: 9.99 },
      ],
      total: 722.25,
      notes: "Pedido cancelado por falta de disponibilidad.",
      affectsInventory: false,
    },

    // Gastos generales
    {
      id: "TRX006",
      type: "gasto",
      date: getRelativeDate(-10),
      paymentDeadline: getRelativeDate(-10), // Mismo día para gastos inmediatos
      status: "pagado",
      total: 250.0,
      expenseCategory: "servicios",
      paymentMethod: "transferencia",
      recipient: "Compañía Eléctrica",
      reference: "Factura #EL-2025-03",
      notes: "Pago de electricidad mensual.",
    },
    {
      id: "TRX007",
      type: "gasto",
      date: getRelativeDate(-5),
      paymentDeadline: getRelativeDate(25),
      status: "pendiente",
      total: 1200.0,
      expenseCategory: "alquiler",
      paymentMethod: "transferencia",
      recipient: "Inmobiliaria Central",
      reference: "Contrato #IC-2023-45",
      notes: "Alquiler mensual del local.",
    },
    {
      id: "TRX008",
      type: "gasto",
      date: getRelativeDate(-15),
      paymentDeadline: getRelativeDate(-15),
      status: "pagado",
      total: 350.0,
      expenseCategory: "marketing",
      paymentMethod: "tarjeta",
      recipient: "Agencia Publicitaria",
      reference: "Campaña primavera",
      notes: "Diseño de folletos promocionales.",
    },
    {
      id: "TRX009",
      type: "gasto",
      date: getRelativeDate(-20),
      paymentDeadline: getRelativeDate(10),
      status: "pendiente",
      total: 180.5,
      expenseCategory: "mantenimiento",
      paymentMethod: "efectivo",
      recipient: "Servicios Técnicos",
      reference: "Orden #ST-789",
      notes: "Reparación de aire acondicionado.",
    },
    {
      id: "TRX010",
      type: "gasto",
      date: getRelativeDate(-8),
      paymentDeadline: getRelativeDate(-8),
      status: "pagado",
      total: 75.25,
      expenseCategory: "suministros",
      paymentMethod: "efectivo",
      recipient: "Papelería Moderna",
      reference: "Ticket #PM-456",
      notes: "Compra de material de oficina.",
    },
    {
      id: "TRX011",
      type: "pedido",
      date: getRelativeDate(-12),
      paymentDeadline: getRelativeDate(18),
      status: "pendiente",
      supplier: suppliers[0],
      items: [
        { id: "PROD002", name: "Ibuprofeno 400mg", quantity: 45, price: 6.5 },
        { id: "PROD004", name: "Loratadina 10mg", quantity: 30, price: 7.25 },
      ],
      total: 509.75,
      notes: "Pedido para reposición de stock.",
      affectsInventory: true,
    },
    {
      id: "TRX012",
      type: "gasto",
      date: getRelativeDate(-3),
      paymentDeadline: getRelativeDate(-3),
      status: "pagado",
      total: 2500.0,
      expenseCategory: "salarios",
      paymentMethod: "transferencia",
      recipient: "Nómina empleados",
      reference: "Nómina marzo 2025",
      notes: "Pago quincenal de salarios.",
    },
  ];
};

const sampleTransactions = generateSampleTransactions();

// Componente para mostrar detalles de una transacción
function TransactionDetailsDialog({
  transaction,
  open,
  onClose,
  onStatusChange,
}: {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (transactionId: string, newStatus: TransactionStatus) => void;
}) {
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  if (!transaction) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = getDaysRemaining(transaction.paymentDeadline);

  const handleStatusChange = (newStatus: TransactionStatus) => {
    setIsChangingStatus(true);

    // Simulamos el cambio de estado
    setTimeout(() => {
      onStatusChange(transaction.id, newStatus);
      setIsChangingStatus(false);
      onClose();

      toast("Estado actualizado", {
        description: `La transacción ${transaction.id} ha sido marcada como ${
          newStatus === "pagado"
            ? "pagada"
            : newStatus === "pendiente"
            ? "pendiente"
            : "cancelada"
        }`,
      });
    }, 1000);
  };

  // Renderizar contenido específico según el tipo de transacción
  const renderTransactionSpecificContent = () => {
    if (transaction.type === "pedido") {
      return (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium">Información del Proveedor</h3>
              <div className="mt-2 rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={transaction.supplier?.avatar}
                      alt={transaction.supplier?.name}
                    />
                    <AvatarFallback>
                      {transaction.supplier?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {transaction.supplier?.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.supplier?.email}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.supplier?.phone}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium">Información del Pedido</h3>
              <div className="mt-2 rounded-lg border p-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Fecha de pedido:</div>
                  <div className="font-medium">
                    {formatDate(transaction.date)}
                  </div>

                  <div className="text-muted-foreground">
                    Fecha límite de pago:
                  </div>
                  <div className="font-medium">
                    {formatDate(transaction.paymentDeadline)}
                    {transaction.status === "pendiente" && (
                      <span
                        className={`ml-2 text-xs ${
                          daysRemaining <= 0
                            ? "text-destructive"
                            : daysRemaining <= 7
                            ? "text-amber-500"
                            : "text-green-500"
                        }`}
                      >
                        {daysRemaining <= 0
                          ? "(Vencido)"
                          : `(${daysRemaining} días restantes)`}
                      </span>
                    )}
                  </div>

                  <div className="text-muted-foreground">Total:</div>
                  <div className="font-medium">
                    ${transaction.total.toFixed(2)}
                  </div>

                  <div className="text-muted-foreground">
                    Afecta inventario:
                  </div>
                  <div className="font-medium">
                    {transaction.affectsInventory ? "Sí" : "No"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium">Productos</h3>
            <div className="mt-2">
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
                  {transaction.items?.map((item) => (
                    <TableRow key={item.id}>
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
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      ${transaction.total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      );
    } else {
      // Contenido para gastos
      return (
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium">Información del Gasto</h3>
            <div className="mt-2 rounded-lg border p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Categoría:</div>
                <div className="font-medium">
                  {expenseCategories.find(
                    (cat) => cat.id === transaction.expenseCategory
                  )?.name || "No especificada"}
                </div>

                <div className="text-muted-foreground">Destinatario:</div>
                <div className="font-medium">{transaction.recipient}</div>

                <div className="text-muted-foreground">Referencia:</div>
                <div className="font-medium">{transaction.reference}</div>

                <div className="text-muted-foreground">Método de pago:</div>
                <div className="font-medium">
                  {paymentMethods.find(
                    (method) => method.id === transaction.paymentMethod
                  )?.name || "No especificado"}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium">Información de Pago</h3>
            <div className="mt-2 rounded-lg border p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Fecha del gasto:</div>
                <div className="font-medium">
                  {formatDate(transaction.date)}
                </div>

                <div className="text-muted-foreground">Fecha de pago:</div>
                <div className="font-medium">
                  {formatDate(transaction.paymentDeadline)}
                  {transaction.status === "pendiente" && (
                    <span
                      className={`ml-2 text-xs ${
                        daysRemaining <= 0
                          ? "text-destructive"
                          : daysRemaining <= 7
                          ? "text-amber-500"
                          : "text-green-500"
                      }`}
                    >
                      {daysRemaining <= 0
                        ? "(Vencido)"
                        : `(${daysRemaining} días restantes)`}
                    </span>
                  )}
                </div>

                <div className="text-muted-foreground">Total:</div>
                <div className="font-medium">
                  ${transaction.total.toFixed(2)}
                </div>

                <div className="text-muted-foreground">Estado:</div>
                <div className="font-medium">
                  <Badge
                    variant={
                      transaction.status === "pagado"
                        ? "success"
                        : transaction.status === "pendiente"
                        ? "outline"
                        : "destructive"
                    }
                  >
                    {transaction.status === "pagado"
                      ? "Pagado"
                      : transaction.status === "pendiente"
                      ? "Pendiente"
                      : "Cancelado"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>
              {transaction.type === "pedido"
                ? "Pedido a Proveedor"
                : "Gasto General"}{" "}
              #{transaction.id}
            </span>
            <Badge
              variant={
                transaction.status === "pagado"
                  ? "success"
                  : transaction.status === "pendiente"
                  ? "outline"
                  : "destructive"
              }
            >
              {transaction.status === "pagado"
                ? "Pagado"
                : transaction.status === "pendiente"
                ? "Pendiente"
                : "Cancelado"}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Información completa de la transacción y estado de pago
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {renderTransactionSpecificContent()}

          {transaction.notes && (
            <div>
              <h3 className="text-sm font-medium">Notas</h3>
              <div className="mt-2 rounded-lg border p-4 text-sm">
                {transaction.notes}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <div className="flex gap-2">
            {transaction.status !== "pagado" && (
              <Button
                variant="default"
                onClick={() => handleStatusChange("pagado")}
                disabled={isChangingStatus}
              >
                {isChangingStatus ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Marcar como pagado
                  </>
                )}
              </Button>
            )}

            {transaction.status !== "pendiente" && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange("pendiente")}
                disabled={isChangingStatus}
              >
                <Clock className="mr-2 h-4 w-4" />
                Marcar como pendiente
              </Button>
            )}

            {transaction.status !== "cancelado" && (
              <Button
                variant="destructive"
                onClick={() => handleStatusChange("cancelado")}
                disabled={isChangingStatus}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar transacción
              </Button>
            )}
          </div>

          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente para crear un nuevo pedido
function NewOrderDialog({
  open,
  onClose,
  onCreateTransaction,
}: {
  open: boolean;
  onClose: () => void;
  onCreateTransaction: (transaction: Omit<Transaction, "id">) => void;
}) {
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedItems, setSelectedItems] = useState<
    {
      productId: string;
      quantity: number;
    }[]
  >([]);
  const [paymentDeadline, setPaymentDeadline] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() + 30))
  );
  const [notes, setNotes] = useState("");
  const [affectsInventory, setAffectsInventory] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resetear el formulario al abrir
  const resetForm = () => {
    setSelectedSupplier("");
    setSelectedItems([]);
    setPaymentDeadline(new Date(new Date().setDate(new Date().getDate() + 30)));
    setNotes("");
    setAffectsInventory(true);
  };

  // Agregar un producto al pedido
  const addProduct = () => {
    setSelectedItems([...selectedItems, { productId: "", quantity: 1 }]);
  };

  // Actualizar un producto en el pedido
  const updateProduct = (
    index: number,
    field: "productId" | "quantity",
    value: string | number
  ) => {
    const updatedItems = [...selectedItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setSelectedItems(updatedItems);
  };

  // Eliminar un producto del pedido
  const removeProduct = (index: number) => {
    const updatedItems = [...selectedItems];
    updatedItems.splice(index, 1);
    setSelectedItems(updatedItems);
  };

  // Calcular el total del pedido
  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  // Manejar la creación del pedido
  const handleCreateOrder = () => {
    // Validar que se haya seleccionado un proveedor
    if (!selectedSupplier) {
      toast("Error", {
        description: "Debe seleccionar un proveedor",
      });
      return;
    }

    // Validar que se hayan agregado productos
    if (selectedItems.length === 0) {
      toast("Error", {
        description: "Debe agregar al menos un producto",
      });
      return;
    }

    // Validar que todos los productos tengan un ID y una cantidad válida
    const invalidItems = selectedItems.filter(
      (item) => !item.productId || item.quantity <= 0
    );
    if (invalidItems.length > 0) {
      toast("Error", {
        description:
          "Todos los productos deben tener un ID y una cantidad válida",
      });
      return;
    }

    // Validar que se haya seleccionado una fecha límite de pago
    if (!paymentDeadline) {
      toast("Error", {
        description: "Debe seleccionar una fecha límite de pago",
      });
      return;
    }

    setIsSubmitting(true);

    // Crear el pedido
    const supplier = suppliers.find((s) => s.id === selectedSupplier);
    if (!supplier) {
      toast("Error", {
        description: "Proveedor no encontrado",
      });
      setIsSubmitting(false);
      return;
    }

    const items = selectedItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return {
          id: item.productId,
          name: "Producto desconocido",
          quantity: item.quantity,
          price: 0,
        };
      }
      return {
        id: product.id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const newTransaction: Omit<Transaction, "id"> = {
      type: "pedido",
      date: new Date().toISOString().split("T")[0],
      paymentDeadline: paymentDeadline.toISOString().split("T")[0],
      status: "pendiente",
      supplier,
      items,
      total: calculateTotal(),
      notes: notes.trim() || undefined,
      affectsInventory,
    };

    // Simulamos la creación del pedido
    setTimeout(() => {
      onCreateTransaction(newTransaction);
      setIsSubmitting(false);
      resetForm();
      onClose();
    }, 1000);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        } else {
          resetForm();
        }
      }}
    >
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Nuevo Pedido a Proveedor</DialogTitle>
          <DialogDescription>
            Complete los detalles para crear un nuevo pedido
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="supplier">Proveedor</Label>
              <Select
                value={selectedSupplier}
                onValueChange={setSelectedSupplier}
              >
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fecha límite de pago</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {paymentDeadline ? (
                      new Date(paymentDeadline).toLocaleDateString()
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={paymentDeadline}
                    onSelect={setPaymentDeadline}
                    disabled={(date) => {
                      // Deshabilitar fechas anteriores a hoy
                      const today = new Date();
                      return date < today;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label>Productos</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addProduct}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Agregar producto
              </Button>
            </div>

            <div className="mt-2 space-y-4">
              {selectedItems.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <ShoppingBag className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">
                    No hay productos seleccionados
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Haga clic en "Agregar producto" para comenzar a agregar
                    productos al pedido.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Precio unitario</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedItems.map((item, index) => {
                      const product = products.find(
                        (p) => p.id === item.productId
                      );
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Select
                              value={item.productId}
                              onValueChange={(value) =>
                                updateProduct(index, "productId", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar producto" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((product) => (
                                  <SelectItem
                                    key={product.id}
                                    value={product.id}
                                  >
                                    {product.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateProduct(
                                  index,
                                  "quantity",
                                  Number.parseInt(e.target.value) || 0
                                )
                              }
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            ${product ? product.price.toFixed(2) : "0.00"}
                          </TableCell>
                          <TableCell>
                            $
                            {product
                              ? (product.price * item.quantity).toFixed(2)
                              : "0.00"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeProduct(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">
                        Total
                      </TableCell>
                      <TableCell className="font-bold">
                        ${calculateTotal().toFixed(2)}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Label
              htmlFor="affects-inventory"
              className="flex items-center gap-2"
            >
              <input
                type="checkbox"
                id="affects-inventory"
                checked={affectsInventory}
                onChange={(e) => setAffectsInventory(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              Este pedido afecta al inventario (aumentará el stock al recibirse)
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              placeholder="Instrucciones especiales o información adicional"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleCreateOrder} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando pedido...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Crear pedido
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente para crear un nuevo gasto
function NewExpenseDialog({
  open,
  onClose,
  onCreateTransaction,
}: {
  open: boolean;
  onClose: () => void;
  onCreateTransaction: (transaction: Omit<Transaction, "id">) => void;
}) {
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory | "">(
    ""
  );
  const [recipient, setRecipient] = useState("");
  const [reference, setReference] = useState("");
  const [total, setTotal] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(new Date());
  const [isPaid, setIsPaid] = useState(true);
  const [paymentDeadline, setPaymentDeadline] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() + 30))
  );
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resetear el formulario al abrir
  const resetForm = () => {
    setExpenseCategory("");
    setRecipient("");
    setReference("");
    setTotal("");
    setPaymentMethod("");
    setPaymentDate(new Date());
    setIsPaid(true);
    setPaymentDeadline(new Date(new Date().setDate(new Date().getDate() + 30)));
    setNotes("");
  };

  // Manejar la creación del gasto
  const handleCreateExpense = () => {
    // Validaciones básicas
    if (!expenseCategory) {
      toast("Error", {
        description: "Debe seleccionar una categoría de gasto",
      });
      return;
    }

    if (!recipient) {
      toast("Error", {
        description: "Debe ingresar un destinatario",
      });
      return;
    }

    const totalAmount = Number.parseFloat(total);
    if (isNaN(totalAmount) || totalAmount <= 0) {
      toast("Error", {
        description: "Debe ingresar un monto válido",
      });
      return;
    }

    if (!paymentMethod) {
      toast("Error", {
        description: "Debe seleccionar un método de pago",
      });
      return;
    }

    if (isPaid && !paymentDate) {
      toast("Error", {
        description: "Debe seleccionar una fecha de pago",
      });
      return;
    }

    if (!isPaid && !paymentDeadline) {
      toast("Error", {
        description: "Debe seleccionar una fecha límite de pago",
      });
      return;
    }

    setIsSubmitting(true);

    // Crear el gasto
    const newTransaction: Omit<Transaction, "id"> = {
      type: "gasto",
      date: new Date().toISOString().split("T")[0],
      paymentDeadline: isPaid
        ? paymentDate?.toISOString().split("T")[0] ||
          new Date().toISOString().split("T")[0]
        : paymentDeadline?.toISOString().split("T")[0] ||
          new Date().toISOString().split("T")[0],
      status: isPaid ? "pagado" : "pendiente",
      total: totalAmount,
      expenseCategory,
      paymentMethod,
      recipient,
      reference,
      notes: notes.trim() || undefined,
    };

    // Simulamos la creación del gasto
    setTimeout(() => {
      onCreateTransaction(newTransaction);
      setIsSubmitting(false);
      resetForm();
      onClose();
    }, 1000);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        } else {
          resetForm();
        }
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nuevo Gasto</DialogTitle>
          <DialogDescription>
            Registre un nuevo gasto general de la empresa
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="expense-category">Categoría de gasto</Label>
              <Select
                value={expenseCategory}
                onValueChange={(value: ExpenseCategory) =>
                  setExpenseCategory(value)
                }
              >
                <SelectTrigger id="expense-category">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="total">Monto total</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  $
                </span>
                <Input
                  id="total"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  className="pl-7"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="recipient">Destinatario</Label>
              <Input
                id="recipient"
                placeholder="Nombre de la empresa o persona"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Referencia</Label>
              <Input
                id="reference"
                placeholder="Número de factura, contrato, etc."
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-method">Método de pago</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="payment-method">
                <SelectValue placeholder="Seleccionar método de pago" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="payment-status">Estado de pago</Label>
              <RadioGroup
                defaultValue="paid"
                value={isPaid ? "paid" : "pending"}
                onValueChange={(value) => setIsPaid(value === "paid")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paid" id="paid" />
                  <Label htmlFor="paid">Pagado</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pending" id="pending" />
                  <Label htmlFor="pending">Pendiente</Label>
                </div>
              </RadioGroup>
            </div>

            {isPaid ? (
              <div className="space-y-2">
                <Label>Fecha de pago</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {paymentDate ? (
                        new Date(paymentDate).toLocaleDateString()
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={paymentDate}
                      onSelect={setPaymentDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Fecha límite de pago</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {paymentDeadline ? (
                        new Date(paymentDeadline).toLocaleDateString()
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={paymentDeadline}
                      onSelect={setPaymentDeadline}
                      disabled={(date) => {
                        // Deshabilitar fechas anteriores a hoy
                        const today = new Date();
                        return date < today;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              placeholder="Información adicional sobre el gasto"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleCreateExpense} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando gasto...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Registrar gasto
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente principal
export default function TransaccionesPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(sampleTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "todos">(
    "todos"
  );
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "todos">(
    "todos"
  );
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false);
  const [showNewExpenseDialog, setShowNewExpenseDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null
  );
  const [isExporting, setIsExporting] = useState(false);

  // Filtrar transacciones según los criterios seleccionados
  const filteredTransactions = transactions.filter((transaction) => {
    // Filtro por término de búsqueda
    const matchesSearch =
      searchTerm === "" ||
      normalizeText(transaction.id).includes(normalizeText(searchTerm)) ||
      (transaction.type === "pedido" &&
        transaction.supplier?.name &&
        normalizeText(transaction.supplier.name).includes(
          normalizeText(searchTerm)
        )) ||
      (transaction.type === "gasto" &&
        transaction.recipient &&
        normalizeText(transaction.recipient).includes(
          normalizeText(searchTerm)
        ));

    // Filtro por tipo
    const matchesType =
      typeFilter === "todos" || transaction.type === typeFilter;

    // Filtro por estado
    const matchesStatus =
      statusFilter === "todos" || transaction.status === statusFilter;

    // Filtro por rango de fechas
    const transactionDate = new Date(transaction.date);
    const matchesDateFrom =
      !dateRange.from || transactionDate >= dateRange.from;
    const matchesDateTo =
      !dateRange.to ||
      transactionDate <= new Date(dateRange.to.setHours(23, 59, 59, 999));

    return (
      matchesSearch &&
      matchesType &&
      matchesStatus &&
      matchesDateFrom &&
      matchesDateTo
    );
  });

  // Función para mostrar detalles de una transacción
  const showTransactionDetailsDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
  };

  // Función para cambiar el estado de una transacción
  const handleStatusChange = (
    transactionId: string,
    newStatus: TransactionStatus
  ) => {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === transactionId
          ? { ...transaction, status: newStatus }
          : transaction
      )
    );
  };

  // Función para crear una nueva transacción
  const handleCreateTransaction = (newTransaction: Omit<Transaction, "id">) => {
    // Generar un ID para la nueva transacción
    const transactionId = `TRX${String(transactions.length + 1).padStart(
      3,
      "0"
    )}`;

    // Agregar la nueva transacción al estado
    setTransactions([
      {
        ...newTransaction,
        id: transactionId,
      },
      ...transactions,
    ]);

    toast("Transacción registrada", {
      description: `La transacción ${transactionId} ha sido registrada correctamente`,
    });
  };

  // Función para eliminar una transacción
  const handleDeleteTransaction = () => {
    if (!transactionToDelete) return;

    setTransactions(
      transactions.filter(
        (transaction) => transaction.id !== transactionToDelete
      )
    );
    setTransactionToDelete(null);
    setShowDeleteDialog(false);

    toast("Transacción eliminada", {
      description: `La transacción ${transactionToDelete} ha sido eliminada correctamente`,
    });
  };

  // Función para exportar transacciones
  const handleExport = () => {
    setIsExporting(true);

    // Simulamos la exportación
    setTimeout(() => {
      setIsExporting(false);
      toast("Reporte exportado", {
        description: `Se ha generado un reporte con ${filteredTransactions.length} transacciones`,
      });
    }, 2000);
  };

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  // Función para calcular los días restantes hasta la fecha límite de pago
  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Función para obtener el color del indicador de fecha límite
  const getDeadlineIndicatorColor = (daysRemaining: number) => {
    if (daysRemaining <= 0) return "bg-destructive";
    if (daysRemaining <= 7) return "bg-amber-500";
    return "bg-green-500";
  };

  // Función para obtener el porcentaje de tiempo restante
  const getTimeRemainingPercentage = (orderDate: string, deadline: string) => {
    const start = new Date(orderDate).getTime();
    const end = new Date(deadline).getTime();
    const now = new Date().getTime();

    const totalDuration = end - start;
    const elapsed = now - start;

    // Si ya pasó la fecha límite, retornar 100%
    if (elapsed >= totalDuration) return 100;

    // Calcular el porcentaje transcurrido
    return Math.round((elapsed / totalDuration) * 100);
  };

  // Calcular totales para el resumen
  const totalPendingOrders = transactions
    .filter((t) => t.type === "pedido" && t.status === "pendiente")
    .reduce((sum, t) => sum + t.total, 0);
  const totalPendingExpenses = transactions
    .filter((t) => t.type === "gasto" && t.status === "pendiente")
    .reduce((sum, t) => sum + t.total, 0);
  const totalPaidThisMonth = (() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return transactions
      .filter(
        (t) =>
          t.status === "pagado" &&
          new Date(t.paymentDeadline) >= firstDayOfMonth
      )
      .reduce((sum, t) => sum + t.total, 0);
  })();

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-white">
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          title="Transacciones"
          subTitle="Gestione pedidos a proveedores y gastos generales"
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Nueva Transacción
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setShowNewOrderDialog(true)}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Pedido a Proveedor
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowNewExpenseDialog(true)}
                    >
                      <Receipt className="mr-2 h-4 w-4" />
                      Gasto General
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  onClick={handleExport}
                  variant="outline"
                  disabled={isExporting || filteredTransactions.length === 0}
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
                      Exportar
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Tarjetas de resumen */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pedidos Pendientes
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${totalPendingOrders.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {
                      transactions.filter(
                        (t) => t.type === "pedido" && t.status === "pendiente"
                      ).length
                    }{" "}
                    pedidos por pagar
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Gastos Pendientes
                  </CardTitle>
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${totalPendingExpenses.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {
                      transactions.filter(
                        (t) => t.type === "gasto" && t.status === "pendiente"
                      ).length
                    }{" "}
                    gastos por pagar
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pagado este mes
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${totalPaidThisMonth.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 flex items-center">
                      <ArrowUp className="mr-1 h-4 w-4" />
                      {
                        transactions.filter(
                          (t) =>
                            t.status === "pagado" &&
                            new Date(t.paymentDeadline).getMonth() ===
                              new Date().getMonth()
                        ).length
                      }{" "}
                      transacciones
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="todos" className="w-full">
              <TabsList>
                <TabsTrigger
                  value="todos"
                  onClick={() => setTypeFilter("todos")}
                >
                  Todos
                </TabsTrigger>
                <TabsTrigger
                  value="pedidos"
                  onClick={() => setTypeFilter("pedido")}
                >
                  Pedidos
                </TabsTrigger>
                <TabsTrigger
                  value="gastos"
                  onClick={() => setTypeFilter("gasto")}
                >
                  Gastos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="todos" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                    <CardDescription>
                      Utilice los filtros para encontrar transacciones
                      específicas
                    </CardDescription>
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
                            placeholder="Buscar por ID, proveedor..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Estado</Label>
                        <Select
                          value={statusFilter}
                          onValueChange={(value: any) => setStatusFilter(value)}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Todos los estados" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">
                              Todos los estados
                            </SelectItem>
                            <SelectItem value="pendiente">Pendiente</SelectItem>
                            <SelectItem value="pagado">Pagado</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 lg:col-span-2">
                        <Label>Rango de fechas</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
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
                              <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="range"
                              selected={{
                                from: dateRange.from || undefined,
                                to: dateRange.to || undefined,
                              }}
                              onSelect={(range) => {
                                if (range) {
                                  setDateRange({
                                    from: range.from,
                                    to: range.to,
                                  });
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
                      <CardTitle>Lista de Transacciones</CardTitle>
                      <CardDescription>
                        {filteredTransactions.length} transacciones encontradas
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchTerm("");
                        setTypeFilter("todos");
                        setStatusFilter("todos");
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
                            <TableHead>ID</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Proveedor/Destinatario</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Fecha límite de pago</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">
                              Acciones
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTransactions.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={8}
                                className="h-24 text-center"
                              >
                                No se encontraron transacciones con los filtros
                                seleccionados
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredTransactions.map((transaction) => {
                              const daysRemaining = getDaysRemaining(
                                transaction.paymentDeadline
                              );
                              const timeRemainingPercentage =
                                getTimeRemainingPercentage(
                                  transaction.date,
                                  transaction.paymentDeadline
                                );

                              return (
                                <TableRow key={transaction.id}>
                                  <TableCell className="font-medium">
                                    {transaction.id}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className={
                                        transaction.type === "pedido"
                                          ? "bg-blue-50 text-blue-700 border-blue-200"
                                          : "bg-purple-50 text-purple-700 border-purple-200"
                                      }
                                    >
                                      <div className="flex items-center gap-1">
                                        {transaction.type === "pedido" ? (
                                          <>
                                            <Package className="h-3 w-3" />
                                            <span>Pedido</span>
                                          </>
                                        ) : (
                                          <>
                                            <Receipt className="h-3 w-3" />
                                            <span>Gasto</span>
                                          </>
                                        )}
                                      </div>
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {transaction.type === "pedido" ? (
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                          <AvatarImage
                                            src={transaction.supplier?.avatar}
                                            alt={transaction.supplier?.name}
                                          />
                                          <AvatarFallback>
                                            {transaction.supplier?.name.charAt(
                                              0
                                            )}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">
                                          {transaction.supplier?.name}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <Building className="h-4 w-4 text-muted-foreground" />
                                        <div>{transaction.recipient}</div>
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {formatDate(transaction.date)}
                                  </TableCell>
                                  <TableCell>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        {formatDate(
                                          transaction.paymentDeadline
                                        )}
                                        {transaction.status === "pendiente" && (
                                          <Badge
                                            variant={
                                              daysRemaining <= 0
                                                ? "destructive"
                                                : daysRemaining <= 7
                                                ? "outline"
                                                : "secondary"
                                            }
                                            className="ml-2"
                                          >
                                            {daysRemaining <= 0
                                              ? "Vencido"
                                              : `${daysRemaining} días`}
                                          </Badge>
                                        )}
                                      </div>

                                      {transaction.status === "pendiente" && (
                                        <div className="flex items-center gap-2">
                                          <Progress
                                            value={timeRemainingPercentage}
                                            className={cn(
                                              "h-1.5 w-full",
                                              getDeadlineIndicatorColor(
                                                daysRemaining
                                              )
                                            )}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    ${transaction.total.toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={
                                        transaction.status === "pagado"
                                          ? "success"
                                          : transaction.status === "pendiente"
                                          ? "outline"
                                          : "destructive"
                                      }
                                    >
                                      {transaction.status === "pagado"
                                        ? "Pagado"
                                        : transaction.status === "pendiente"
                                        ? "Pendiente"
                                        : "Cancelado"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>
                                          Acciones
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          onClick={() =>
                                            showTransactionDetailsDialog(
                                              transaction
                                            )
                                          }
                                        >
                                          <Eye className="mr-2 h-4 w-4" />
                                          Ver detalles
                                        </DropdownMenuItem>

                                        {transaction.status === "pendiente" && (
                                          <DropdownMenuItem
                                            onClick={() => {
                                              setSelectedTransaction(
                                                transaction
                                              );
                                              handleStatusChange(
                                                transaction.id,
                                                "pagado"
                                              );
                                              toast("Estado actualizado", {
                                                description: `La transacción ${transaction.id} ha sido marcada como pagada`,
                                              });
                                            }}
                                          >
                                            <Check className="mr-2 h-4 w-4" />
                                            Marcar como pagado
                                          </DropdownMenuItem>
                                        )}

                                        {transaction.status !== "cancelado" && (
                                          <DropdownMenuItem
                                            onClick={() => {
                                              setSelectedTransaction(
                                                transaction
                                              );
                                              handleStatusChange(
                                                transaction.id,
                                                "cancelado"
                                              );
                                              toast("Estado actualizado", {
                                                description: `La transacción ${transaction.id} ha sido cancelada`,
                                              });
                                            }}
                                          >
                                            <X className="mr-2 h-4 w-4" />
                                            Cancelar transacción
                                          </DropdownMenuItem>
                                        )}

                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          className="text-destructive focus:text-destructive"
                                          onClick={() => {
                                            setTransactionToDelete(
                                              transaction.id
                                            );
                                            setShowDeleteDialog(true);
                                          }}
                                        >
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Eliminar transacción
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          )}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pedidos" className="space-y-4">
                {/* Contenido específico para pedidos */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pedidos a Proveedores</CardTitle>
                    <CardDescription>
                      Gestión de pedidos de productos a proveedores
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Los pedidos a proveedores afectan directamente al
                      inventario de productos cuando son recibidos. Utilice esta
                      sección para gestionar todos sus pedidos y mantener un
                      control adecuado de sus compras.
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">
                          Resumen de Pedidos
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {
                            transactions.filter((t) => t.type === "pedido")
                              .length
                          }{" "}
                          pedidos en total
                        </p>
                      </div>
                      <Button
                        onClick={() => setShowNewOrderDialog(true)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Nuevo Pedido
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gastos" className="space-y-4">
                {/* Contenido específico para gastos */}
                <Card>
                  <CardHeader>
                    <CardTitle>Gastos Generales</CardTitle>
                    <CardDescription>
                      Gestión de gastos operativos de la empresa
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Los gastos generales representan los costos operativos de
                      la empresa que no están directamente relacionados con la
                      adquisición de productos para la venta. Utilice esta
                      sección para registrar y controlar todos los gastos de la
                      empresa.
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">
                          Resumen de Gastos
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {
                            transactions.filter((t) => t.type === "gasto")
                              .length
                          }{" "}
                          gastos en total
                        </p>
                      </div>
                      <Button
                        onClick={() => setShowNewExpenseDialog(true)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Nuevo Gasto
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      {/* Diálogo de detalles de la transacción */}
      <TransactionDetailsDialog
        transaction={selectedTransaction}
        open={showTransactionDetails}
        onClose={() => setShowTransactionDetails(false)}
        onStatusChange={handleStatusChange}
      />

      {/* Diálogo de nuevo pedido */}
      <NewOrderDialog
        open={showNewOrderDialog}
        onClose={() => setShowNewOrderDialog(false)}
        onCreateTransaction={handleCreateTransaction}
      />

      {/* Diálogo de nuevo gasto */}
      <NewExpenseDialog
        open={showNewExpenseDialog}
        onClose={() => setShowNewExpenseDialog(false)}
        onCreateTransaction={handleCreateTransaction}
      />

      {/* Diálogo de confirmación para eliminar transacción */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la transacción{" "}
              {transactionToDelete}. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTransaction}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
