"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
} from "@/presentation/components/ui/sidebar";
import { Button } from "../ui/button";
import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    title: string;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup className=" h-full mt-5">
      <SidebarMenu className="overflow-hidden">
        {items.map((item) => (
          <SidebarMenuButton
            tooltip={item.title}
            key={item.title}
            className={`flex items-center text-sm font-semibold py-2 px-6 rounded-bl-md text-content-muted hover:bg-hover-background-color hover:shadow-inner hover:inset-shadow-sm hover:text-content-normal ${
              pathname === item.url &&
              "bg-hover-background-color shadow-inner shadow-black/10 inset-shadow-sm text-content-normal hover:bg-hover-background-color hover:shadow-inner hover:inset-shadow-sm"
            }`}
            asChild
          >
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href={item.url} className="py-5">
                {item.icon && <item.icon className="mr-2" />}
                <span className="truncate">{item.title}</span>
                {pathname === item.url && <ChevronRight className="ml-auto" />}
              </Link>
            </Button>
          </SidebarMenuButton>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
