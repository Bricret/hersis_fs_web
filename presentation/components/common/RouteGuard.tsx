"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthFetch } from "@/presentation/hooks/auth/useAuthFetch";
import { LoadingState } from "./LoadingState";

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "pharmacist" | "any";
  fallback?: React.ReactNode;
}

export function RouteGuard({
  children,
  requiredRole = "any",
  fallback,
}: RouteGuardProps) {
  const router = useRouter();
  const { getUserAuth, hasRouteAccess, isAdmin, isPharmacist } = useAuthFetch();
  const user = getUserAuth();

  useEffect(() => {
    // Si no hay usuario autenticado, redirigir al login
    if (!user) {
      router.push("/login");
      return;
    }

    // Verificar acceso según el rol requerido
    if (requiredRole === "admin" && !isAdmin()) {
      router.push("/");
      return;
    }

    if (requiredRole === "pharmacist" && !isPharmacist()) {
      router.push("/");
      return;
    }
  }, [user, requiredRole, router, isAdmin, isPharmacist]);

  // Mostrar loading mientras se verifica la autenticación
  if (!user) {
    return fallback || <LoadingState />;
  }

  // Verificar acceso según el rol requerido
  if (requiredRole === "admin" && !isAdmin()) {
    return (
      fallback || (
        <div>Acceso denegado. Se requieren permisos de administrador.</div>
      )
    );
  }

  if (requiredRole === "pharmacist" && !isPharmacist()) {
    return (
      fallback || (
        <div>Acceso denegado. Se requieren permisos de farmacéutico.</div>
      )
    );
  }

  return <>{children}</>;
}
