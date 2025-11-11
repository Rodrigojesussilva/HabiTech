"use client";

import { type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
};

type SidebarCtx = {
  isMobile?: boolean;
  setOpenMobile?: (open: boolean) => void;
};

export function NavMain({ items }: { items: NavItem[] }) {
  const sidebarUnknown = useSidebar() as unknown;

  const { isMobile, setOpenMobile } = ((): SidebarCtx => {
    if (typeof sidebarUnknown === "object" && sidebarUnknown !== null) {
      const maybe = sidebarUnknown as Partial<SidebarCtx>;
      return { isMobile: maybe.isMobile, setOpenMobile: maybe.setOpenMobile };
    }
    return {};
  })();

  const handleClick = () => {
    try {
      if (isMobile && typeof setOpenMobile === "function") {
        setOpenMobile(false);
      }
    } catch (_err) {
      void _err;
    }
  };

  return (
  <SidebarGroup className="-ml-2">
    <SidebarGroupLabel className="px-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-600" aria-hidden />
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-700">
            Formulários
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-700">Cadastrados</span>
        </div>
      </div>
    </SidebarGroupLabel>

    <div className="mx-2 mt-2 h-px bg-slate-200/80" />

    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.url}>
          <Link to={item.url} className="w-full" onClick={handleClick}>
            <SidebarMenuButton className="cursor-pointer" tooltip={item.title}>
              <div className="flex bg-secondary aspect-square size-8 text-primary items-center justify-center rounded-lg">
                {item.icon && <item.icon />}
              </div>
              <span className="text-primary">{item.title}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  </SidebarGroup>
);


}
