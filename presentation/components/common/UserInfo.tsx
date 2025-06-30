"use client";

import { useAuthFetch } from "@/presentation/hooks/auth/useAuthFetch";
import { Badge } from "@/presentation/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { User, Shield, ShoppingCart, Package } from "lucide-react";

export function UserInfo() {
  const { getUserAuth, isAdmin, isPharmacist, getAllowedRoutes } =
    useAuthFetch();
  const user = getUserAuth();
  const allowedRoutes = getAllowedRoutes();

  if (!user) {
    return null;
  }

  const getRoleIcon = () => {
    if (isAdmin()) return <Shield className="h-4 w-4" />;
    if (isPharmacist()) return <ShoppingCart className="h-4 w-4" />;
    return <User className="h-4 w-4" />;
  };

  const getRoleColor = () => {
    if (isAdmin()) return "bg-red-100 text-red-800";
    if (isPharmacist()) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  const getRoleName = () => {
    if (isAdmin()) return "Administrador";
    if (isPharmacist()) return "Farmacéutico";
    return "Usuario";
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Información del Usuario
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Nombre:</span>
            <span className="text-sm text-gray-600">{user.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Email:</span>
            <span className="text-sm text-gray-600">{user.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Rol:</span>
            <Badge className={`flex items-center gap-1 ${getRoleColor()}`}>
              {getRoleIcon()}
              {getRoleName()}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Package className="h-4 w-4" />
            Rutas Permitidas:
          </h4>
          <div className="flex flex-wrap gap-1">
            {allowedRoutes.map((route) => (
              <Badge key={route} variant="outline" className="text-xs">
                {route === "/" ? "Dashboard" : route.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500">
            {isAdmin()
              ? "Tienes acceso completo a todas las funcionalidades del sistema."
              : isPharmacist()
              ? "Tienes acceso limitado a ventas y caja."
              : "Tienes acceso básico al sistema."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
