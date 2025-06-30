"use client";

import { SidebarTrigger } from "../ui/sidebar-trigger";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import NotificationPopover from "./NotificationPopover";
import { cn } from "@/infraestructure/lib/utils";
import { logOutFn } from "@/infraestructure/utils/logOutFn";
import { useRouter } from "next/navigation";
import { useAuthFetch } from "@/presentation/hooks/auth/useAuthFetch";
import { UserProfileDialog } from "./UserProfileDialog";

export const Header = ({
  className,
  children,
  title,
  subTitle,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
  props?: React.ComponentProps<"div">;
  title: string;
  subTitle: string;
}) => {
  const router = useRouter();

  const { getUserAuth } = useAuthFetch();

  const user = getUserAuth();

  if (!user) {
    return;
  }

  console.log(user);

  const handleLogOut = () => {
    logOutFn();
    router.push("/login");
  };

  return (
    <header
      className={cn(
        "flex items-center justify-between py-3 pl-3 pr-6 border-b border-b-border-main",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-4 mr-3">
        <div className="p-2">
          <SidebarTrigger />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground text-sm">{subTitle}</p>
        </div>
      </div>
      {children}
      <div className="flex items-center gap-4">
        <NotificationPopover />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline-flex">{user.name}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <UserProfileDialog
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
              }
            />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
