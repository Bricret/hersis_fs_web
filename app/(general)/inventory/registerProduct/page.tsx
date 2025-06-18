import { Header } from "@/presentation/components/common/Header";
import RegisterProductForm from "@/presentation/components/inventory/RegisterProductForm";
import { getCategories } from "@/presentation/services/server/category.server";
import { Loader2 } from "lucide-react";

export default async function RegisterProductPage() {
  const categories = await getCategories();

  if (!categories) {
    return (
      <main className="flex flex-col flex-1 overflow-hidden bg-white">
        <Header
          title="Registrar Producto"
          subTitle="Aquí podrás registrar un nuevo producto en tu inventario."
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span>Cargando categorías...</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col flex-1 overflow-hidden bg-white">
      <Header
        title="Registrar Producto"
        subTitle="Aquí podrás registrar un nuevo producto en tu inventario."
      />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <RegisterProductForm categorias={categories} />
      </div>
    </main>
  );
}
