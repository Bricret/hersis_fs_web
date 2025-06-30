"use client";

import { useState } from "react";
import { useAuthFetch } from "@/presentation/hooks/auth/useAuthFetch";
import { Badge } from "@/presentation/components/ui/badge";
import { Button } from "@/presentation/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/presentation/components/ui/dialog";
import { User, Shield, ShoppingCart, Package, Mail } from "lucide-react";

interface UserProfileDialogProps {
  trigger?: React.ReactNode;
}

export function UserProfileDialog({ trigger }: UserProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const { getUserAuth, isAdmin, isPharmacist, getAllowedRoutes } =
    useAuthFetch();
  const user = getUserAuth();
  const allowedRoutes = getAllowedRoutes();

  if (!user) return null;

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" className="w-full justify-start">
            <User className="mr-2 h-4 w-4" />
            Perfil
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil de Usuario
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{user.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                {user.email}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Rol:</span>
              <Badge className={`flex items-center gap-1 ${getRoleColor()}`}>
                {getRoleIcon()}
                {getRoleName()}
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                Funcionalidades Disponibles
              </h4>
              <div className="flex flex-wrap gap-1">
                {allowedRoutes.map((route) => (
                  <Badge key={route} variant="outline" className="text-xs">
                    {route === "/" ? "Dashboard" : route.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
