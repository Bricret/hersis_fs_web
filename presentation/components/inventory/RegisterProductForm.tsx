"use client";

import { MedicineInventory } from "@/core/domain/entity/inventory.entity";
import type { Category } from "@/core/domain/entity/categories.entity";
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
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { ScrollArea } from "@/presentation/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { Switch } from "@/presentation/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/presentation/components/ui/tooltip";
import {
  Check,
  Download,
  FileSpreadsheet,
  Info,
  Loader2,
  Package,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { ProductState } from "@/infraestructure/schema/inventory.schema";
import { GeneralInventory } from "@/core/domain/entity/inventory.entity";
import { createInventory } from "@/presentation/services/server/inventory.server";

// Props del componente
interface RegisterProductFormProps {
  categorias: Category[];
}

// Datos de ejemplo para los selectores (mantenemos estos hasta tener endpoints para cada uno)
const formasFarmaceuticas = [
  "Tableta",
  "Cápsula",
  "Jarabe",
  "Suspensión",
  "Crema",
  "Ungüento",
  "Inyectable",
  "Gotas",
  "Parche",
  "Polvo",
  "Otro",
];

const proveedores = [
  "Farmacéutica Nacional",
  "MediPharma",
  "Laboratorios Médicos",
  "Distribuidora Farmacéutica",
  "Importadora Médica",
  "Otro",
];

const medicamentoVacio: MedicineInventory = {
  barCode: "",
  name: "",
  active_name: "",
  dosage: "",
  presentation: "",
  sales_price: 0,
  purchase_price: 0,
  units_per_box: 1,
  initial_quantity: 0,
  laboratory: "",
  expiration_date: "",
  prescription: false,
  description: "",
  type: ProductState.MEDICINE,
  administration_route: "",
  category: "",
  lot_number: "",
  is_active: true,
  created_at: new Date(),
  updated_at: new Date(),
};

const productoGeneralVacio: GeneralInventory = {
  barCode: "",
  name: "",
  description: "",
  sales_price: 0,
  purchase_price: 0,
  units_per_box: 1,
  initial_quantity: 0,
  type: ProductState.GENERAL,
  lot_number: "",
  expiration_date: "",
  brand: "",
  model: "",
  is_active: true,
  created_at: new Date(),
  updated_at: new Date(),
};

// Componente para la plantilla de Excel
function PlantillaExcel() {
  const descargarPlantilla = () => {
    // En una implementación real, esto generaría un archivo CSV o Excel
    // Para este ejemplo, simplemente mostramos un mensaje
    toast("Plantilla descargada", {
      description: "La plantilla ha sido descargada correctamente",
      duration: 1500,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Plantilla para registro masivo
        </CardTitle>
        <CardDescription>
          Descargue la plantilla, complete los datos y súbala para registrar
          múltiples medicamentos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center">
          <FileSpreadsheet className="h-10 w-10 text-muted-foreground" />
          <div>
            <h3 className="font-medium">Plantilla de Excel</h3>
            <p className="text-sm text-muted-foreground">
              Formato con todos los campos necesarios para el registro masivo
            </p>
          </div>
          <Button onClick={descargarPlantilla} className="gap-2">
            <Download className="h-4 w-4" />
            Descargar plantilla
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para la carga de archivo
function CargaArchivo({
  onFileProcessed,
}: {
  onFileProcessed: (
    productos: (MedicineInventory | GeneralInventory)[]
  ) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("eventualmente hare que esto funcione");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Cargar archivo</CardTitle>
        <CardDescription>
          Suba un archivo CSV o Excel con los datos de los productos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div>
            <h3 className="font-medium">
              Arrastre su archivo aquí o haga clic para seleccionarlo
            </h3>
            <p className="text-sm text-muted-foreground">
              Formatos soportados: .xlsx, .xls, .csv
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={handleFileUpload}
              id="file-upload"
            />
            <Button asChild className="gap-2" disabled={isUploading}>
              <label htmlFor="file-upload" className="cursor-pointer">
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Seleccionar archivo
                  </>
                )}
              </label>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para el formulario de medicamento individual
function FormularioMedicamento({
  medicamento,
  onChange,
  onSave,
  isNew = true,
  categorias,
}: {
  medicamento: MedicineInventory & { errors?: Record<string, string> };
  onChange: (field: string, value: any) => void;
  onSave: () => void;
  isNew?: boolean;
  categorias: Category[];
}) {
  const errors = medicamento.errors || {};
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="barCode">Código / SKU</Label>
          <Input
            id="barCode"
            value={medicamento.barCode}
            onChange={(e) => onChange("barCode", e.target.value)}
            placeholder="Ej: MED001"
            required
          />
          {errors.codigo && (
            <span className="text-xs text-red-500">{errors.codigo}</span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del medicamento</Label>
          <Input
            id="name"
            value={medicamento.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Ej: Paracetamol 500mg"
            required
          />
          {errors.nombre && (
            <span className="text-xs text-red-500">{errors.nombre}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="active_name">Principio activo</Label>
          <Input
            id="active_name"
            value={medicamento.active_name}
            onChange={(e) => onChange("active_name", e.target.value)}
            placeholder="Ej: Paracetamol"
          />
          {errors.principioActivo && (
            <span className="text-xs text-red-500">
              {errors.principioActivo}
            </span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="dosage">Dosis</Label>
          <Input
            id="dosage"
            value={medicamento.dosage}
            onChange={(e) => onChange("dosage", e.target.value)}
            placeholder="Ej: 1 tableta cada 8 horas"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="administration_route">Vía de administración</Label>
          <Input
            id="administration_route"
            value={medicamento.administration_route}
            onChange={(e) => onChange("administration_route", e.target.value)}
            placeholder="Ej: Oral, Intravenosa, etc."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="presentation">Concentración</Label>
          <Input
            id="presentation"
            value={medicamento.presentation}
            onChange={(e) => onChange("presentation", e.target.value)}
            placeholder="Ej: 500mg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="forma_farmaceutica">Forma farmacéutica</Label>
          <Select
            value={medicamento.presentation}
            onValueChange={(value) => onChange("presentation", value)}
            required
          >
            <SelectTrigger id="forma_farmaceutica">
              <SelectValue placeholder="Seleccione una forma farmacéutica" />
            </SelectTrigger>
            <SelectContent>
              {formasFarmaceuticas.map((forma) => (
                <SelectItem key={forma} value={forma}>
                  {forma}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select
            value={medicamento.category}
            onValueChange={(value) => onChange("category", value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Seleccione una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((categoria) => (
                <SelectItem key={categoria.id} value={categoria.name}>
                  {categoria.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="purchase_price">Precio de compra (C$)</Label>
          <Input
            id="purchase_price"
            type="number"
            min="0"
            step="0.01"
            value={medicamento.purchase_price}
            onChange={(e) =>
              onChange("purchase_price", Number.parseFloat(e.target.value) || 0)
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sales_price">Precio de venta (C$)</Label>
          <Input
            id="sales_price"
            type="number"
            min="0"
            step="0.01"
            value={medicamento.sales_price}
            onChange={(e) =>
              onChange("sales_price", Number.parseFloat(e.target.value) || 0)
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="units_per_box">Unidades por caja</Label>
          <Input
            id="units_per_box"
            type="number"
            min="1"
            value={medicamento.units_per_box}
            onChange={(e) =>
              onChange("units_per_box", Number.parseInt(e.target.value) || 1)
            }
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="initial_quantity">Stock inicial</Label>
          <Input
            id="initial_quantity"
            type="number"
            min="0"
            value={medicamento.initial_quantity}
            onChange={(e) =>
              onChange("initial_quantity", Number.parseInt(e.target.value) || 0)
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="laboratory">Proveedor</Label>
          <Select
            value={medicamento.laboratory}
            onValueChange={(value) => onChange("laboratory", value)}
          >
            <SelectTrigger id="laboratory">
              <SelectValue placeholder="Seleccione un proveedor" />
            </SelectTrigger>
            <SelectContent>
              {proveedores.map((proveedor) => (
                <SelectItem key={proveedor} value={proveedor}>
                  {proveedor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiration_date">Fecha de vencimiento</Label>
          <Input
            id="expiration_date"
            type="date"
            value={medicamento.expiration_date}
            onChange={(e) => onChange("expiration_date", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="prescription"
          checked={medicamento.prescription}
          onCheckedChange={(checked) => onChange("prescription", checked)}
        />
        <Label htmlFor="prescription">Requiere receta médica</Label>
      </div>

      {/* Campo Descripción/Notas ocupa todo el ancho y tiene borde */}
      <div className="md:col-span-full">
        <Label htmlFor="description" className="pb-2">
          Descripción / Notas
        </Label>
        <textarea
          id="description"
          value={medicamento.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Información adicional sobre el medicamento"
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={onSave} className="gap-2">
          <Save className="h-4 w-4" />
          {isNew ? "Guardar medicamento" : "Actualizar medicamento"}
        </Button>
      </div>
    </div>
  );
}

// Componente para el formulario de producto general
function FormularioProductoGeneral({
  producto,
  onChange,
  onSave,
  isNew = true,
}: {
  producto: GeneralInventory & { errors?: Record<string, string> };
  onChange: (field: string, value: any) => void;
  onSave: () => void;
  isNew?: boolean;
}) {
  const errors = producto.errors || {};
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="barCode">Código / SKU</Label>
          <Input
            id="barCode"
            value={producto.barCode}
            onChange={(e) => onChange("barCode", e.target.value)}
            placeholder="Ej: PROD001"
            required
          />
          {errors.codigo && (
            <span className="text-xs text-red-500">{errors.codigo}</span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del producto</Label>
          <Input
            id="name"
            value={producto.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Ej: Aspirina 500mg"
            required
          />
          {errors.nombre && (
            <span className="text-xs text-red-500">{errors.nombre}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <textarea
            id="description"
            value={producto.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Descripción del producto"
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {errors.descripcion && (
            <span className="text-xs text-red-500">{errors.descripcion}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="purchase_price">Precio de compra ($)</Label>
          <Input
            id="purchase_price"
            type="number"
            min="0"
            step="0.01"
            value={producto.purchase_price}
            onChange={(e) =>
              onChange("purchase_price", Number.parseFloat(e.target.value) || 0)
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sales_price">Precio de venta ($)</Label>
          <Input
            id="sales_price"
            type="number"
            min="0"
            step="0.01"
            value={producto.sales_price}
            onChange={(e) =>
              onChange("sales_price", Number.parseFloat(e.target.value) || 0)
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="units_per_box">Unidades por caja</Label>
          <Input
            id="units_per_box"
            type="number"
            min="1"
            value={producto.units_per_box}
            onChange={(e) =>
              onChange("units_per_box", Number.parseInt(e.target.value) || 1)
            }
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="initial_quantity">Stock inicial</Label>
          <Input
            id="initial_quantity"
            type="number"
            min="0"
            value={producto.initial_quantity}
            onChange={(e) =>
              onChange("initial_quantity", Number.parseInt(e.target.value) || 0)
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Marca</Label>
          <Input
            id="brand"
            value={producto.brand}
            onChange={(e) => onChange("brand", e.target.value)}
            placeholder="Ej: Bayer"
          />
          {errors.marca && (
            <span className="text-xs text-red-500">{errors.marca}</span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Modelo</Label>
          <Input
            id="model"
            value={producto.model}
            onChange={(e) => onChange("model", e.target.value)}
            placeholder="Ej: Aspirina 500mg"
          />
          {errors.modelo && (
            <span className="text-xs text-red-500">{errors.modelo}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="expiration_date">Fecha de vencimiento</Label>
          <Input
            id="expiration_date"
            type="date"
            value={producto.expiration_date}
            onChange={(e) => onChange("expiration_date", e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onSave} className="gap-2">
          <Save className="h-4 w-4" />
          {isNew ? "Guardar producto general" : "Actualizar producto general"}
        </Button>
      </div>
    </div>
  );
}

export default function RegisterProductForm({
  categorias,
}: RegisterProductFormProps) {
  const [medicamentos, setMedicamentos] = useState<MedicineInventory[]>([]);
  const [productosGenerales, setProductosGenerales] = useState<
    GeneralInventory[]
  >([]);
  const [tipoProducto, setTipoProducto] = useState<ProductState>(
    ProductState.MEDICINE
  );
  const [medicamentoActual, setMedicamentoActual] = useState<
    MedicineInventory & { errors?: Record<string, string> }
  >({
    ...medicamentoVacio,
    errors: {},
  });
  const [productoGeneralActual, setProductoGeneralActual] = useState<
    GeneralInventory & { errors?: Record<string, string> }
  >({
    ...productoGeneralVacio,
    errors: {},
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejar cambios en el formulario actual
  const handleChange = (field: string, value: any) => {
    if (tipoProducto === ProductState.MEDICINE) {
      setMedicamentoActual((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else {
      setProductoGeneralActual((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Validar producto
  const validarProducto = (
    producto: MedicineInventory | GeneralInventory
  ): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Validaciones básicas para todos los productos
    if (!producto.barCode) errors.codigo = "El código es obligatorio";
    if (!producto.name) errors.nombre = "El nombre es obligatorio";
    if (producto.purchase_price <= 0)
      errors.precioCompra = "El precio de compra debe ser mayor a 0";
    if (producto.sales_price <= 0)
      errors.precioVenta = "El precio de venta debe ser mayor a 0";
    if (producto.sales_price <= producto.purchase_price) {
      errors.precioVenta =
        "El precio de venta debe ser mayor al precio de compra";
      toast.error("Error de validación", {
        description: "El precio de venta debe ser mayor al precio de compra",
        duration: 3000,
      });
    }

    // Validaciones específicas según el tipo de producto
    if (tipoProducto === ProductState.MEDICINE) {
      const med = producto as MedicineInventory;
      if (!med.active_name)
        errors.principioActivo = "El principio activo es obligatorio";
      if (!med.category) errors.categoria = "La categoría es obligatoria";
      if (!med.dosage) errors.dosage = "La dosis es obligatoria";
    } else {
      const prod = producto as GeneralInventory;
      if (!prod.brand) errors.marca = "La marca es obligatoria";
      if (!prod.model) errors.modelo = "El modelo es obligatorio";
    }

    // Validar código único solo si no está en modo edición
    if (editIndex === null) {
      if (tipoProducto === ProductState.MEDICINE) {
        if (medicamentos.some((m) => m.barCode === producto.barCode)) {
          errors.codigo = "Este código ya existe";
          toast.error("Error de validación", {
            description: "Este código ya existe en la lista",
            duration: 3000,
          });
        }
      } else {
        if (productosGenerales.some((p) => p.barCode === producto.barCode)) {
          errors.codigo = "Este código ya existe";
          toast.error("Error de validación", {
            description: "Este código ya existe en la lista",
            duration: 3000,
          });
        }
      }
    }

    return errors;
  };

  // Agregar o actualizar producto
  const agregarProducto = () => {
    const producto =
      tipoProducto === ProductState.MEDICINE
        ? medicamentoActual
        : productoGeneralActual;
    const errors = validarProducto(producto);

    if (Object.keys(errors).length > 0) {
      if (tipoProducto === ProductState.MEDICINE) {
        setMedicamentoActual((prev) => ({ ...prev, errors }));
      } else {
        setProductoGeneralActual((prev) => ({ ...prev, errors }));
      }
      return;
    }

    if (editIndex !== null) {
      if (tipoProducto === ProductState.MEDICINE) {
        const nuevosMedicamentos = [...medicamentos];
        nuevosMedicamentos[editIndex] = { ...medicamentoActual };
        setMedicamentos(nuevosMedicamentos);
      } else {
        const nuevosProductos = [...productosGenerales];
        nuevosProductos[editIndex] = { ...productoGeneralActual };
        setProductosGenerales(nuevosProductos);
      }
      setEditIndex(null);

      toast.success("Producto actualizado", {
        description: `${producto.name} ha sido actualizado`,
        duration: 1500,
      });
    } else {
      if (tipoProducto === ProductState.MEDICINE) {
        setMedicamentos([...medicamentos, { ...medicamentoActual }]);
      } else {
        setProductosGenerales([
          ...productosGenerales,
          { ...productoGeneralActual },
        ]);
      }

      toast.success("Producto agregado", {
        description: `${producto.name} ha sido agregado a la lista`,
        duration: 1500,
      });
    }

    // Limpiar formulario
    if (tipoProducto === ProductState.MEDICINE) {
      setMedicamentoActual({ ...medicamentoVacio, errors: {} });
    } else {
      setProductoGeneralActual({ ...productoGeneralVacio, errors: {} });
    }
  };

  // Editar producto
  const editProduct = (index: number) => {
    if (tipoProducto === ProductState.MEDICINE) {
      setMedicamentoActual({ ...medicamentos[index] });
    } else {
      setProductoGeneralActual({ ...productosGenerales[index] });
    }
    setEditIndex(index);
  };

  // Eliminar producto
  const deleteProduct = (index: number) => {
    if (tipoProducto === ProductState.MEDICINE) {
      const nuevosMedicamentos = [...medicamentos];
      nuevosMedicamentos.splice(index, 1);
      setMedicamentos(nuevosMedicamentos);
    } else {
      const nuevosProductos = [...productosGenerales];
      nuevosProductos.splice(index, 1);
      setProductosGenerales(nuevosProductos);
    }

    // Si estábamos editando este producto, limpiar el formulario
    if (editIndex === index) {
      if (tipoProducto === ProductState.MEDICINE) {
        setMedicamentoActual({ ...medicamentoVacio });
      } else {
        setProductoGeneralActual({ ...productoGeneralVacio });
      }
      setEditIndex(null);
    }

    toast("Producto eliminado", {
      description: "El producto ha sido eliminado de la lista",
      duration: 1500,
    });
  };

  // Procesar archivo cargado
  const processFile = (
    productosCargados: (MedicineInventory | GeneralInventory)[]
  ) => {
    const medicamentosValidos = productosCargados.filter((prod) => {
      const errors = validarProducto(prod);
      return Object.keys(errors).length === 0;
    });

    if (tipoProducto === ProductState.MEDICINE) {
      setMedicamentos([
        ...medicamentos,
        ...(medicamentosValidos as MedicineInventory[]),
      ]);
    } else {
      setProductosGenerales([
        ...productosGenerales,
        ...(medicamentosValidos as GeneralInventory[]),
      ]);
    }
  };

  // Guardar todos los productos
  const onSaveAll = async () => {
    const productos =
      tipoProducto === ProductState.MEDICINE
        ? medicamentos
        : productosGenerales;

    if (productos.length === 0) {
      toast("No hay productos", {
        description: "Agregue al menos un producto para guardar",
        duration: 1500,
      });
      return;
    }

    try {
      console.log(productos);
      setIsSubmitting(true);
      const response = await createInventory(productos);
      setIsSubmitting(false);
      setShowSuccessDialog(true);
      toast.success(response.message);
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Error al guardar los productos", {
        description: "Intente nuevamente",
        duration: 1500,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {editIndex !== null
                ? "Editar producto"
                : "Agregar nuevo producto"}
            </CardTitle>
            <CardDescription>
              Seleccione el tipo de producto y complete los datos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="pb-6">
              <Label className="mb-2">Tipo de producto</Label>
              <Select
                value={tipoProducto}
                onValueChange={(value) => {
                  setTipoProducto(value as ProductState);
                  setMedicamentoActual({ ...medicamentoVacio });
                  setProductoGeneralActual({ ...productoGeneralVacio });
                  setEditIndex(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo de producto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ProductState.MEDICINE}>
                    Medicamento
                  </SelectItem>
                  <SelectItem value={ProductState.GENERAL}>
                    Producto general
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {tipoProducto === ProductState.MEDICINE ? (
              <FormularioMedicamento
                medicamento={medicamentoActual}
                onChange={handleChange}
                onSave={agregarProducto}
                isNew={editIndex === null}
                categorias={categorias}
              />
            ) : (
              <FormularioProductoGeneral
                producto={productoGeneralActual}
                onChange={handleChange}
                onSave={agregarProducto}
                isNew={editIndex === null}
              />
            )}
          </CardContent>
          {editIndex !== null && (
            <CardFooter className="justify-between border-t px-6 py-4">
              <Button
                variant="outline"
                onClick={() => {
                  if (tipoProducto === ProductState.MEDICINE) {
                    setMedicamentoActual({ ...medicamentoVacio });
                  } else {
                    setProductoGeneralActual({ ...productoGeneralVacio });
                  }
                  setEditIndex(null);
                }}
              >
                Cancelar edición
              </Button>
            </CardFooter>
          )}
        </Card>

        <div className="space-y-6">
          <PlantillaExcel />
          <CargaArchivo onFileProcessed={processFile} />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              Lista de productos a registrar
            </CardTitle>
            <CardDescription>
              {tipoProducto === ProductState.MEDICINE
                ? `${medicamentos.length} medicamentos`
                : `${productosGenerales.length} productos generales`}{" "}
              listos para guardar
            </CardDescription>
          </div>
          <Button
            onClick={onSaveAll}
            disabled={
              (tipoProducto === ProductState.MEDICINE
                ? medicamentos.length === 0
                : productosGenerales.length === 0) || isSubmitting
            }
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar todos
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {(tipoProducto === ProductState.MEDICINE &&
            medicamentos.length === 0) ||
          (tipoProducto === ProductState.GENERAL &&
            productosGenerales.length === 0) ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center">
              <Package className="h-10 w-10 text-muted-foreground" />
              <div>
                <h3 className="font-medium">No hay productos en la lista</h3>
                <p className="text-sm text-muted-foreground">
                  Agregue productos usando el formulario o cargue un archivo
                </p>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    {tipoProducto === ProductState.MEDICINE ? (
                      <>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Dosis</TableHead>
                        <TableHead>Administración</TableHead>
                      </>
                    ) : (
                      <>
                        <TableHead>Marca</TableHead>
                        <TableHead>Modelo</TableHead>
                      </>
                    )}
                    <TableHead>Precio compra</TableHead>
                    <TableHead>Precio venta</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tipoProducto === ProductState.MEDICINE
                    ? medicamentos.map((med, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {med.barCode}
                          </TableCell>
                          <TableCell>{med.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{med.category}</Badge>
                          </TableCell>
                          <TableCell>{med.dosage}</TableCell>
                          <TableCell>{med.administration_route}</TableCell>
                          <TableCell>${med.sales_price.toFixed(2)}</TableCell>
                          <TableCell>
                            ${med.purchase_price.toFixed(2)}
                          </TableCell>
                          <TableCell>{med.initial_quantity}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => editProduct(index)}
                                    >
                                      <Info className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Editar producto</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-destructive"
                                      onClick={() => deleteProduct(index)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Eliminar producto</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    : productosGenerales.map((prod, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {prod.barCode}
                          </TableCell>
                          <TableCell>{prod.name}</TableCell>
                          <TableCell>{prod.brand}</TableCell>
                          <TableCell>{prod.model}</TableCell>
                          <TableCell>${prod.sales_price.toFixed(2)}</TableCell>
                          <TableCell>
                            ${prod.purchase_price.toFixed(2)}
                          </TableCell>
                          <TableCell>{prod.initial_quantity}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => editProduct(index)}
                                    >
                                      <Info className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Editar producto</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-destructive"
                                      onClick={() => deleteProduct(index)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Eliminar producto</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de confirmación para limpiar la lista */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará todos los productos de la lista. Esta acción
              no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (tipoProducto === ProductState.MEDICINE) {
                  setMedicamentos([]);
                  setMedicamentoActual({ ...medicamentoVacio });
                } else {
                  setProductosGenerales([]);
                  setProductoGeneralActual({ ...productoGeneralVacio });
                }
                setEditIndex(null);
                toast("Lista limpiada", {
                  description:
                    "Todos los productos han sido eliminados de la lista",
                  duration: 1500,
                });
              }}
            >
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de éxito */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¡Productos guardados!</DialogTitle>
            <DialogDescription>
              Se han guardado{" "}
              {tipoProducto === ProductState.MEDICINE
                ? medicamentos.length
                : productosGenerales.length}{" "}
              productos correctamente en el sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="flex h-20 items-center justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                if (tipoProducto === ProductState.MEDICINE) {
                  setMedicamentos([]);
                  setMedicamentoActual({ ...medicamentoVacio });
                } else {
                  setProductosGenerales([]);
                  setProductoGeneralActual({ ...productoGeneralVacio });
                }
                setEditIndex(null);
              }}
              className="w-full"
            >
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
