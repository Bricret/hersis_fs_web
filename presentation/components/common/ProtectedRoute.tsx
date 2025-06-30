"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthFetch } from "@/presentation/hooks/auth/useAuthFetch";
import { LoadingState } from "./LoadingState";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { getUserAuth, hasRouteAccess } = useAuthFetch();
  const user = getUserAuth();

  useEffect(() => {
    // Si no hay usuario autenticado, redirigir al login
    if (!user) {
      router.push("/login");
      return;
    }

    // Verificar si el usuario tiene acceso a la ruta actual
    if (!hasRouteAccess(pathname)) {
      // Redirigir al dashboard si no tiene acceso
      router.push("/");
      return;
    }
  }, [user, pathname, router, hasRouteAccess]);

  // Mostrar loading mientras se verifica la autenticación
  if (!user) {
    return fallback || <LoadingState />;
  }

  // Verificar acceso a la ruta actual
  if (!hasRouteAccess(pathname)) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Acceso Denegado
            </h2>
            <p className="text-gray-600">
              No tienes permisos para acceder a esta página.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
