import * as React from "react";
import { Stamp, House, Factory, Building } from "lucide-react";
import { FaPeopleRoof } from "react-icons/fa6";
import { NavMain } from "@/components/navigation/sidebar/NavMain";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const data = {
  navMain: [
    { title: "Selagem", url: "/lista-selagens", icon: Stamp, isActive: true, items: [] },
    { title: "Arrolamento", url: "/lista-arrolamentos", icon: FaPeopleRoof, items: [] },
    { title: "Residencial", url: "#", icon: House, items: [] },
    { title: "Não Residencial", url: "#", icon: Factory, items: [] },
    { title: "Ocupação Predial", url: "#", icon: Building, items: [] },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="border-r bg-sidebar" 
    >
      <Link to="/home" className="sr-only">
        Ir para a Home
      </Link>

      {/* conteúdo da sidebar */}
      <SidebarContent className="px-3 pt-4 pb-2">
        <NavMain items={data.navMain} />
      </SidebarContent>

      {/* footer  */}
      <SidebarFooter className=" px-3 py-17 mt-auto">
        <div className="flex justify-center">
          <img
            src="/psp.png"
            alt="Prefeitura de São Paulo"
            className="w-30 md:w-40 h-auto object-contain select-none shrink-0"
            loading="eager"
          />
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
