import { NextRequest, NextResponse } from "next/server";
import { getInventory } from "@/presentation/services/server/inventory.server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";

    // Validar parámetros
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Parámetros inválidos" },
        { status: 400 }
      );
    }

    // Log para debug
    console.log(
      `[API] Búsqueda de inventario - Página: ${page}, Límite: ${limit}, Búsqueda: "${search}"`
    );

    // Obtener inventario usando el servicio existente
    const result = await getInventory(page, limit, search);

    // Log para debug
    console.log(
      `[API] Resultado - Total: ${result.meta.total}, Páginas: ${result.meta.totalPages}, Productos en esta página: ${result.data.length}`
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error en búsqueda de inventario:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
