"use client"

import { type LucideIcon } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const location = useLocation();
  console.log("location", location);
  const { isMobile, setOpenMobile } = useSidebar() as any

  const handleClick = (_e: React.MouseEvent, _url: string) => {
    // Fecha o sidebar no mobile para liberar a tela
    try {
      if (isMobile && typeof setOpenMobile === 'function') {
        setOpenMobile(false)
      }
    } catch {}
  }

  return (
    <SidebarGroup className="-ml-2">
      <SidebarGroupLabel>Formulários</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.url}>
            <Link to={item.url} className="w-full" onClick={(e) => handleClick(e, item.url)}>
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
  )
}
