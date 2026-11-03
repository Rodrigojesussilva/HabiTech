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
import { Link } from "@/lib/Link";

const data = {
  navMain: [
    { title: "Selagem", url: "/lista-selagens", icon: Stamp, isActive: true, items: [] },
    { title: "Arrolamento", url: "/lista-arrolamentos", icon: FaPeopleRoof, items: [] },
    { title: "Residencial", url: "/lista-residenciais", icon: House, items: [] },
    { title: "Não Residencial", url: "/lista-nao-residenciais", icon: Factory, items: [] },
    { title: "Ocupação Predial", url: "/lista-ocupacao-predial", icon: Building, items: [] },
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
      <SidebarContent className="px-3 pt-4 pb-2 group-data-[collapsible=icon]:px-0">
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter className="mt-auto px-3 py-5 group-data-[collapsible=icon]:hidden">
        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-800">
          <img src="/habitech.svg" alt="" className="size-6" />
          <span>HabiTech</span>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
