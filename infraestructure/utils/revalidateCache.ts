"use server";

import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Función para revalidar el cache de manera agresiva en producción
 * Esta función se asegura de que todas las páginas relacionadas se actualicen
 */
export async function revalidateInventoryCache() {
  try {
    // Revalidar todas las rutas relacionadas con inventario
    const pathsToRevalidate = [
      "/inventory",
      "/shop",
      "/",
      "/dashboard",
      "/stats",
      "/reports",
      "/transactions",
    ];

    // Revalidar cada ruta
    pathsToRevalidate.forEach((path) => {
      revalidatePath(path, "page");
      revalidatePath(path, "layout");
    });

    // Revalidar tags específicos
    const tagsToRevalidate = ["inventory", "products", "shop", "cash", "sales"];

    tagsToRevalidate.forEach((tag) => {
      revalidateTag(tag);
    });

    console.log("Cache revalidado exitosamente");
    return { success: true, message: "Cache revalidado" };
  } catch (error) {
    console.error("Error al revalidar cache:", error);
    return { success: false, message: "Error al revalidar cache" };
  }
}

/**
 * Función específica para revalidar después de crear inventario
 */
export async function revalidateAfterInventoryCreation() {
  return await revalidateInventoryCache();
}

/**
 * Función específica para revalidar después de actualizar inventario
 */
export async function revalidateAfterInventoryUpdate() {
  return await revalidateInventoryCache();
}
