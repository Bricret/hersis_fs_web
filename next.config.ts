import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Optimizar el cache para producción
    optimizePackageImports: ["lucide-react"],
  },
  // Configuración de cache para producción
  generateEtags: false,
  // Asegurar que las páginas se revaliden correctamente
  onDemandEntries: {
    // Período de tiempo que una página debe permanecer en el buffer
    maxInactiveAge: 25 * 1000,
    // Número de páginas que deben mantenerse simultáneamente
    pagesBufferLength: 2,
  },
};

export default nextConfig;
