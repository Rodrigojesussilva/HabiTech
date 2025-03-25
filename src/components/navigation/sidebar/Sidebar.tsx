import * as React from "react"
import {
  Fingerprint,
  Stamp,
  House,
  Factory,
  Building,
  Frame,
  Building2,
  Map,
  PieChart,
  Handshake,
  LayoutDashboard,
} from "lucide-react"
import { Link } from "react-router-dom"
import { NavMain } from "@/components/navigation/sidebar/NavMain"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "HabitaSampa",
      logo: Building2,
      plan: "Secretaria da Habitação",
    },

  ],
  navMain: [
    {
      title: "Dashboards",
      url: "/chart",
      icon: LayoutDashboard,
      isActive: true,
      items: [

      ],
    },
    {
      title: "Selagem",
      url: "#",
      icon: Stamp,
      isActive: true,
      items: [

      ],
    },
    {
      title: "Arrolamento",
      url: "/lista-arrolamentos",
      icon: Fingerprint,
      items: [],
    },
    {
      title: "Residencial",
      url: "#",
      icon: House,
      items: [],
    },
    {
      title: "Não Residencial",
      url: "#",
      icon: Factory,
      items: [],
    },
    {
      title: "Ocupação Predial",
      url: "#",
      icon: Building,
      items: [],
    },
    {
      title: "Regularização Fundiária",
      url: "/create-reg-fundiaria",
      icon: Handshake,
      items: [],
    },
    
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="border-r bg-sidebar">
      <Link to={"/home"} className="w-full">
        <SidebarHeader>
          <div className="flex mt-4">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Building2 className="size-4" />
            </div>
            <div className="grid flex-1 ml-2 text-left text-sm leading-tight">
              <span className="truncate font-medium text-primary">{data.teams[0].name}</span>
              <span className="truncate text-xs text-primary">{data.teams[0].plan}</span>
            </div>
          </div>
        </SidebarHeader>
      </Link>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
