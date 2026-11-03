"use client";

import * as React from "react";
import { Link } from "@/lib/Link";
import { FileText } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLocation } from "@/lib/router-compat"

type AnyIcon = React.ComponentType<{ className?: string }>;

type NavItem = {
  title: string;
  url: string;
  icon?: AnyIcon;
  isActive?: boolean;
  items?: { title: string; url: string }[];
};

export function NavMain({ items }: { items: NavItem[] }) {
  const { isMobile, setOpenMobile } = useSidebar()
  const { pathname } = useLocation()

  const handleClick = () => {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-600" aria-hidden />
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-700">
            Formulários cadastrados
          </span>
        </div>
      </SidebarGroupLabel>

      <div className="mx-2 mt-2 h-px bg-slate-200/80" />

      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.url
          return (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                className="h-11 cursor-pointer data-[active=true]:bg-blue-50 data-[active=true]:text-blue-800"
                tooltip={item.title}
              >
                <Link
                  to={item.url}
                  onClick={handleClick}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={item.title}
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-secondary text-primary">
                    {Icon ? <Icon className="h-4 w-4" /> : null}
                  </div>
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
