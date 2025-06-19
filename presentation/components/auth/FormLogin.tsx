"use client";

import { cn } from "@/infraestructure/lib/utils";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent } from "@/presentation/components/ui/card";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import largeLogo from "@/resources/img/large_logo_without_bg.png";
import pharmacyCover from "@/resources/img/pharmacy_cover.jpg";
import { toast } from "sonner";
import { useAuthFetch } from "@/presentation/hooks/auth/useAuthFetch";
import { Loader2 } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { login } = useAuthFetch();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    setIsLoading(true);
    try {
      const response = await login(username, password);

      if (response) {
        setIsLoading(false);
        toast.success("¡Inicio de sesión exitoso!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
      toast.error("Error al intentar iniciar sesión", {
        description:
          error instanceof Error
            ? error.message
            : "Ha ocurrido un error inesperado",
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden py-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmitLogin}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <Image
                  src={largeLogo}
                  alt="LogoEnterprise"
                  className="object-cover dark:brightness-[0.2] dark:grayscale w-52 h-auto mb-4"
                  width={208}
                  height={100}
                  priority
                />
                <h1 className="text-2xl font-bold">Bienvenido de vuelta!</h1>
                <p className="text-balance text-muted-foreground">
                  Inicia sesión para continuar.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Correo Electrónico</Label>
                <Input
                  id="username"
                  placeholder="usuario.rol"
                  required
                  name="username"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <a
                    href="/reset-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <Input id="password" type="password" name="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src={pharmacyCover}
              alt="bgLogin"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              fill
              priority
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Creado con 💖 por <a href="https://oryx-development.com">Oryx Devs</a>
      </div>
    </div>
  );
}
