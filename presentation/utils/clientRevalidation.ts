/**
 * Utilidades para revalidación del lado del cliente
 */

/**
 * Función para forzar la revalidación de una ruta específica
 */
export async function revalidateClientPath(path: string) {
  try {
    const response = await fetch(
      `/api/revalidate?path=${encodeURIComponent(path)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error al revalidar: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al revalidar ruta:", error);
    throw error;
  }
}

/**
 * Función para revalidar múltiples rutas relacionadas con inventario
 */
export async function revalidateInventoryPaths() {
  const paths = [
    "/inventory",
    "/shop",
    "/",
    "/dashboard",
    "/stats",
    "/reports",
  ];

  const promises = paths.map((path) => revalidateClientPath(path));

  try {
    await Promise.all(promises);
    console.log("Todas las rutas revalidadas exitosamente");
  } catch (error) {
    console.error("Error al revalidar rutas:", error);
    // Si falla la revalidación, recargar la página como fallback
    window.location.reload();
  }
}

/**
 * Función para forzar la actualización de datos sin recargar la página
 */
export async function refreshInventoryData() {
  try {
    // Intentar revalidar las rutas
    await revalidateInventoryPaths();

    // Si estamos en una página específica, navegar a ella para forzar la actualización
    const currentPath = window.location.pathname;
    if (currentPath === "/inventory" || currentPath === "/shop") {
      // Usar router.push para navegar sin recargar
      if (typeof window !== "undefined" && window.history) {
        window.history.pushState({}, "", currentPath);
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
    }
  } catch (error) {
    console.error("Error al refrescar datos:", error);
    // Fallback: recargar la página
    window.location.reload();
  }
}
