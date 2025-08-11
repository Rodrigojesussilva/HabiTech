"use client"

import { type LucideIcon } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Swal from 'sweetalert2'

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

  const handleClick = (e: React.MouseEvent, url: string) => {
    if (url.includes('arrolamento')) {
      e.preventDefault()
      Swal.fire({ icon: 'info', title: 'Indisponível', text: 'Arrolamento temporariamente desativado.' })
    }
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
