"use client"

import { ChevronLeftIcon, ChevronRight, ClipboardPen, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
      <SidebarMenu >
        {items.map((item) => (
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={item.title}>
              <div className="flex bg-blue-700 aspect-square size-8 text-white items-center justify-center rounded-lg">
                {item.icon && <item.icon />}
              </div>
              <span className="text-blue-800">{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
