"use client";

import { Header } from "@/presentation/components/common/Header";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/presentation/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/presentation/components/ui/tooltip";
import {
  ArrowLeft,
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

type Medicamento = {
  id?: string;
  codigo: string;
  nombre: string;
  principioActivo: string;
  concentracion: string;
  formaFarmaceutica: string;
  categoria: string;
  precioCompra: number;
  precioVenta: number;
  unidadesPorCaja: number;
  stock: number;
  proveedor: string;
  fechaVencimiento: string;
  requiereReceta: boolean;
  descripcion: string;
  errors?: Record<string, string | undefined>;
};

// Datos de ejemplo para los selectores
const categorias = [
  "Analgésicos",
  "Antiinflamatorios",
  "Antibióticos",
  "Antialérgicos",
  "Antiácidos",
  "Suplementos",
  "Higiene",
  "Otros",
];

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

const medicamentoVacio: Medicamento = {
  codigo: "",
  nombre: "",
  principioActivo: "",
  concentracion: "",
  formaFarmaceutica: "",
  categoria: "",
  precioCompra: 0,
  precioVenta: 0,
  unidadesPorCaja: 1,
  stock: 0,
  proveedor: "",
  fechaVencimiento: "",
  requiereReceta: false,
  descripcion: "",
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
  onFileProcessed: (medicamentos: Medicamento[]) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Simulamos el procesamiento del archivo
    setTimeout(() => {
      // En una implementación real, aquí procesaríamos el archivo CSV/Excel
      // Para este ejemplo, generamos datos de prueba
      const medicamentosPrueba: Medicamento[] = [
        {
          codigo: "MED001",
          nombre: "Paracetamol 500mg",
          principioActivo: "Paracetamol",
          concentracion: "500mg",
          formaFarmaceutica: "Tableta",
          categoria: "Analgésicos",
          precioCompra: 3.5,
          precioVenta: 5.99,
          unidadesPorCaja: 12,
          stock: 100,
          proveedor: "Farmacéutica Nacional",
          fechaVencimiento: "2025-12-31",
          requiereReceta: false,
          descripcion: "Analgésico y antipirético",
        },
        {
          codigo: "MED002",
          nombre: "Ibuprofeno 400mg",
          principioActivo: "Ibuprofeno",
          concentracion: "400mg",
          formaFarmaceutica: "Tableta",
          categoria: "Antiinflamatorios",
          precioCompra: 4.2,
          precioVenta: 6.5,
          unidadesPorCaja: 10,
          stock: 80,
          proveedor: "MediPharma",
          fechaVencimiento: "2025-10-15",
          requiereReceta: false,
          descripcion: "Antiinflamatorio no esteroideo",
        },
        {
          codigo: "MED003",
          nombre: "Amoxicilina 500mg",
          principioActivo: "Amoxicilina",
          concentracion: "500mg",
          formaFarmaceutica: "Cápsula",
          categoria: "Antibióticos",
          precioCompra: 10.25,
          precioVenta: 15.75,
          unidadesPorCaja: 12,
          stock: 50,
          proveedor: "Laboratorios Médicos",
          fechaVencimiento: "2025-08-20",
          requiereReceta: true,
          descripcion: "Antibiótico de amplio espectro",
        },
      ];

      onFileProcessed(medicamentosPrueba);
      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast("Archivo procesado", {
        description: `Se han cargado ${medicamentosPrueba.length} medicamentos`,
        duration: 1500,
      });
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Cargar archivo</CardTitle>
        <CardDescription>
          Suba un archivo CSV o Excel con los datos de los medicamentos
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
}: {
  medicamento: Medicamento;
  onChange: (field: string, value: any) => void;
  onSave: () => void;
  isNew?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="codigo">Código / SKU</Label>
          <Input
            id="codigo"
            value={medicamento.codigo}
            onChange={(e) => onChange("codigo", e.target.value)}
            placeholder="Ej: MED001"
            className={medicamento.errors?.codigo ? "border-destructive" : ""}
          />
          {medicamento.errors?.codigo && (
            <p className="text-xs text-destructive">
              {medicamento.errors.codigo}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre del medicamento</Label>
          <Input
            id="nombre"
            value={medicamento.nombre}
            onChange={(e) => onChange("nombre", e.target.value)}
            placeholder="Ej: Paracetamol 500mg"
            className={medicamento.errors?.nombre ? "border-destructive" : ""}
          />
          {medicamento.errors?.nombre && (
            <p className="text-xs text-destructive">
              {medicamento.errors.nombre}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="principioActivo">Principio activo</Label>
          <Input
            id="principioActivo"
            value={medicamento.principioActivo}
            onChange={(e) => onChange("principioActivo", e.target.value)}
            placeholder="Ej: Paracetamol"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="concentracion">Concentración</Label>
          <Input
            id="concentracion"
            value={medicamento.concentracion}
            onChange={(e) => onChange("concentracion", e.target.value)}
            placeholder="Ej: 500mg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="formaFarmaceutica">Forma farmacéutica</Label>
          <Select
            value={medicamento.formaFarmaceutica}
            onValueChange={(value) => onChange("formaFarmaceutica", value)}
          >
            <SelectTrigger
              id="formaFarmaceutica"
              className={
                medicamento.errors?.formaFarmaceutica
                  ? "border-destructive"
                  : ""
              }
            >
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
          {medicamento.errors?.formaFarmaceutica && (
            <p className="text-xs text-destructive">
              {medicamento.errors.formaFarmaceutica}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoria">Categoría</Label>
          <Select
            value={medicamento.categoria}
            onValueChange={(value) => onChange("categoria", value)}
          >
            <SelectTrigger
              id="categoria"
              className={
                medicamento.errors?.categoria ? "border-destructive" : ""
              }
            >
              <SelectValue placeholder="Seleccione una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((categoria) => (
                <SelectItem key={categoria} value={categoria}>
                  {categoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {medicamento.errors?.categoria && (
            <p className="text-xs text-destructive">
              {medicamento.errors.categoria}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="precioCompra">Precio de compra ($)</Label>
          <Input
            id="precioCompra"
            type="number"
            min="0"
            step="0.01"
            value={medicamento.precioCompra}
            onChange={(e) =>
              onChange("precioCompra", Number.parseFloat(e.target.value) || 0)
            }
            className={
              medicamento.errors?.precioCompra ? "border-destructive" : ""
            }
          />
          {medicamento.errors?.precioCompra && (
            <p className="text-xs text-destructive">
              {medicamento.errors.precioCompra}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="precioVenta">Precio de venta ($)</Label>
          <Input
            id="precioVenta"
            type="number"
            min="0"
            step="0.01"
            value={medicamento.precioVenta}
            onChange={(e) =>
              onChange("precioVenta", Number.parseFloat(e.target.value) || 0)
            }
            className={
              medicamento.errors?.precioVenta ? "border-destructive" : ""
            }
          />
          {medicamento.errors?.precioVenta && (
            <p className="text-xs text-destructive">
              {medicamento.errors.precioVenta}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="unidadesPorCaja">Unidades por caja</Label>
          <Input
            id="unidadesPorCaja"
            type="number"
            min="1"
            value={medicamento.unidadesPorCaja}
            onChange={(e) =>
              onChange("unidadesPorCaja", Number.parseInt(e.target.value) || 1)
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="stock">Stock inicial</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={medicamento.stock}
            onChange={(e) =>
              onChange("stock", Number.parseInt(e.target.value) || 0)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="proveedor">Proveedor</Label>
          <Select
            value={medicamento.proveedor}
            onValueChange={(value) => onChange("proveedor", value)}
          >
            <SelectTrigger id="proveedor">
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
          <Label htmlFor="fechaVencimiento">Fecha de vencimiento</Label>
          <Input
            id="fechaVencimiento"
            type="date"
            value={medicamento.fechaVencimiento}
            onChange={(e) => onChange("fechaVencimiento", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="requiereReceta"
          checked={medicamento.requiereReceta}
          onCheckedChange={(checked) => onChange("requiereReceta", checked)}
        />
        <Label htmlFor="requiereReceta">Requiere receta médica</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción / Notas</Label>
        <textarea
          id="descripcion"
          value={medicamento.descripcion}
          onChange={(e) => onChange("descripcion", e.target.value)}
          placeholder="Información adicional sobre el medicamento"
          rows={3}
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

// Componente para el formulario múltiple
function FormularioMultiple() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [medicamentoActual, setMedicamentoActual] = useState<Medicamento>({
    ...medicamentoVacio,
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejar cambios en el formulario actual
  const handleChange = (field: string, value: any) => {
    setMedicamentoActual((prev) => ({
      ...prev,
      [field]: value,
      errors: {
        ...prev.errors,
        [field]: undefined, // Limpiar error al cambiar el valor
      },
    }));
  };

  // Validar medicamento
  const validarMedicamento = (med: Medicamento): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!med.codigo) errors.codigo = "El código es obligatorio";
    if (!med.nombre) errors.nombre = "El nombre es obligatorio";
    if (!med.formaFarmaceutica)
      errors.formaFarmaceutica = "La forma farmacéutica es obligatoria";
    if (!med.categoria) errors.categoria = "La categoría es obligatoria";
    if (med.precioCompra <= 0)
      errors.precioCompra = "El precio de compra debe ser mayor a 0";
    if (med.precioVenta <= 0)
      errors.precioVenta = "El precio de venta debe ser mayor a 0";
    if (med.precioVenta < med.precioCompra)
      errors.precioVenta =
        "El precio de venta debe ser mayor al precio de compra";

    // Verificar si el código ya existe (excepto si estamos editando)
    if (
      editIndex === null &&
      medicamentos.some((m) => m.codigo === med.codigo)
    ) {
      errors.codigo = "Este código ya existe";
    }

    return errors;
  };

  // Agregar o actualizar medicamento
  const agregarMedicamento = () => {
    const errors = validarMedicamento(medicamentoActual);

    if (Object.keys(errors).length > 0) {
      setMedicamentoActual((prev) => ({ ...prev, errors }));
      return;
    }

    if (editIndex !== null) {
      // Actualizar medicamento existente
      const nuevosMedicamentos = [...medicamentos];
      nuevosMedicamentos[editIndex] = { ...medicamentoActual };
      setMedicamentos(nuevosMedicamentos);
      setEditIndex(null);

      toast("Medicamento actualizado", {
        description: `${medicamentoActual.nombre} ha sido actualizado`,
        duration: 1500,
      });
    } else {
      // Agregar nuevo medicamento
      setMedicamentos([...medicamentos, { ...medicamentoActual }]);

      toast("Medicamento agregado", {
        description: `${medicamentoActual.nombre} ha sido agregado a la lista`,
        duration: 1500,
      });
    }

    // Limpiar formulario
    setMedicamentoActual({ ...medicamentoVacio });
  };

  // Editar medicamento
  const editarMedicamento = (index: number) => {
    setMedicamentoActual({ ...medicamentos[index] });
    setEditIndex(index);
  };

  // Eliminar medicamento
  const eliminarMedicamento = (index: number) => {
    const nuevosMedicamentos = [...medicamentos];
    nuevosMedicamentos.splice(index, 1);
    setMedicamentos(nuevosMedicamentos);

    // Si estábamos editando este medicamento, limpiar el formulario
    if (editIndex === index) {
      setMedicamentoActual({ ...medicamentoVacio });
      setEditIndex(null);
    }

    toast("Medicamento eliminado", {
      description: "El medicamento ha sido eliminado de la lista",
      duration: 1500,
    });
  };

  // Procesar archivo cargado
  const procesarArchivo = (medicamentosCargados: Medicamento[]) => {
    // Validar y filtrar medicamentos cargados
    const medicamentosValidos = medicamentosCargados.filter((med) => {
      const errors = validarMedicamento(med);
      return Object.keys(errors).length === 0;
    });

    setMedicamentos([...medicamentos, ...medicamentosValidos]);
  };

  // Guardar todos los medicamentos
  const guardarTodos = () => {
    if (medicamentos.length === 0) {
      toast("No hay medicamentos", {
        description: "Agregue al menos un medicamento para guardar",
        duration: 1500,
      });
      return;
    }

    setIsSubmitting(true);

    // Simulamos el guardado en la base de datos
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessDialog(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {editIndex !== null
                ? "Editar medicamento"
                : "Agregar nuevo medicamento"}
            </CardTitle>
            <CardDescription>
              Complete los datos del medicamento y agréguelo a la lista
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormularioMedicamento
              medicamento={medicamentoActual}
              onChange={handleChange}
              onSave={agregarMedicamento}
              isNew={editIndex === null}
            />
          </CardContent>
          {editIndex !== null && (
            <CardFooter className="justify-between border-t px-6 py-4">
              <Button
                variant="outline"
                onClick={() => {
                  setMedicamentoActual({ ...medicamentoVacio });
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
          <CargaArchivo onFileProcessed={procesarArchivo} />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              Lista de medicamentos a registrar
            </CardTitle>
            <CardDescription>
              {medicamentos.length} medicamentos listos para guardar
            </CardDescription>
          </div>
          <Button
            onClick={guardarTodos}
            disabled={medicamentos.length === 0 || isSubmitting}
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
          {medicamentos.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center">
              <Package className="h-10 w-10 text-muted-foreground" />
              <div>
                <h3 className="font-medium">No hay medicamentos en la lista</h3>
                <p className="text-sm text-muted-foreground">
                  Agregue medicamentos usando el formulario o cargue un archivo
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
                    <TableHead>Categoría</TableHead>
                    <TableHead>Precio compra</TableHead>
                    <TableHead>Precio venta</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicamentos.map((med, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {med.codigo}
                      </TableCell>
                      <TableCell>{med.nombre}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{med.categoria}</Badge>
                      </TableCell>
                      <TableCell>${med.precioCompra.toFixed(2)}</TableCell>
                      <TableCell>${med.precioVenta.toFixed(2)}</TableCell>
                      <TableCell>{med.stock}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => editarMedicamento(index)}
                                >
                                  <Info className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Editar medicamento</p>
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
                                  onClick={() => eliminarMedicamento(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Eliminar medicamento</p>
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
              Esta acción eliminará todos los medicamentos de la lista. Esta
              acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setMedicamentos([]);
                setMedicamentoActual({ ...medicamentoVacio });
                setEditIndex(null);
                toast("Lista limpiada", {
                  description:
                    "Todos los medicamentos han sido eliminados de la lista",
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
            <DialogTitle>¡Medicamentos guardados!</DialogTitle>
            <DialogDescription>
              Se han guardado {medicamentos.length} medicamentos correctamente
              en el sistema.
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
                setMedicamentos([]);
                setMedicamentoActual({ ...medicamentoVacio });
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

export default function RegisterProductPage() {
  return (
    <main className="flex flex-col flex-1 overflow-hidden bg-muted">
      <Header
        title="Registrar Producto"
        subTitle="Aquí podrás registrar un nuevo producto en tu inventario."
      />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <Tabs defaultValue="multiple" className="space-y-4">
          <TabsList>
            <TabsTrigger value="individual">Registro Individual</TabsTrigger>
            <TabsTrigger value="multiple">Registro Múltiple</TabsTrigger>
          </TabsList>
          <TabsContent value="individual" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nuevo Medicamento</CardTitle>
                <CardDescription>
                  Complete el formulario para registrar un nuevo medicamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormularioMedicamento
                  medicamento={medicamentoVacio}
                  onChange={() => {}}
                  onSave={() => {
                    toast("Medicamento guardado", {
                      description:
                        "El medicamento ha sido registrado correctamente",
                      duration: 3000,
                    });
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="multiple">
            <FormularioMultiple />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
