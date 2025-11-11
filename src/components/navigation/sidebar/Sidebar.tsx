import * as React from "react";
import { Fingerprint, Stamp, House, Factory, Building } from "lucide-react";
import { NavMain } from "@/components/navigation/sidebar/NavMain";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const data = {
  navMain: [
    { title: "Selagem", url: "/lista-selagens", icon: Stamp, isActive: true, items: [] },
    { title: "Arrolamento", url: "/lista-arrolamentos", icon: Fingerprint, items: [] },
    { title: "Residencial", url: "#", icon: House, items: [] },
    { title: "Não Residencial", url: "#", icon: Factory, items: [] },
    { title: "Ocupação Predial", url: "#", icon: Building, items: [] },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="border-r bg-sidebar">
      {/* Link para Home (sem header vazio, evita bloco branco) */}
      <Link to="/home" className="sr-only">
        Ir para a Home
      </Link>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
