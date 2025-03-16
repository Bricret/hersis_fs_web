"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/presentation/components/ui/sidebar";
import { Button } from "../ui/button";
import Link from "next/link";

export function NavMain({
  items,
  title,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
  }[];
  title: string;
}) {
  return (
    <SidebarGroup className=" h-full">
      <SidebarGroupLabel className="text-base font-semibold text-zinc-200">
        {title}
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-0.5  overflow-hidden">
        {items.map((item) => (
          <SidebarMenuButton
            tooltip={item.title}
            key={item.title}
            className="flex items-center text-sm font-normal py-2 px-6 rounded-lg text-white"
            asChild
          >
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href={item.url} className="py-5">
                {item.icon && <item.icon className="mr-2" />}
                <span className="truncate">{item.title}</span>
              </Link>
            </Button>
          </SidebarMenuButton>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
