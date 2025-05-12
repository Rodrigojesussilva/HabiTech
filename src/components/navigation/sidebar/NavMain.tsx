"use client"

import { type LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
  return (
    <SidebarGroup className="-ml-2">
      <SidebarGroupLabel>Formulários</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.url}>
            <Link to={item.url} className="w-full">
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
