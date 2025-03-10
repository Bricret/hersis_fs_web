"use client";

import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Package2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate login process
    setTimeout(() => {
      setLoading(false);
      router.push("/");
    }, 1500);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/20 to-muted p-4">
      <Card className="mx-auto w-full max-w-md bg-tertiary-background-color border border-border-main">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Package2 className="h-10 w-10 text-content-strong" />
            </div>
          </div>
          <CardTitle className="text-2xl text-content-strong font-bold">
            Hersis Web
          </CardTitle>
          <CardDescription>Sistema de Gestión de Farmacia</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Usuario</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nombre de usuario"
                  required
                  className="border border-border-main"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-sm cursor-pointer"
                  >
                    ¿Olvidó su contraseña?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  className="border border-border-main"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm text-content-muted">
            <p>© {currentYear} Oryx. Todos los derechos reservados.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
