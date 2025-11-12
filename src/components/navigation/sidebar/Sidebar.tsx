import * as React from "react";
import { Fingerprint, Stamp, House, Factory, Building } from "lucide-react";
import { NavMain } from "@/components/navigation/sidebar/NavMain";
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from "@/components/ui/sidebar";

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

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter className="p-1 border-t">
        <div className="flex justify-center">
          <img
            src="/prefeitura.png"
            alt="HabitaSampa"            
            className="w-[var(--logo-w)] md:w-[var(--logo-w-md)] h-auto object-contain select-none shrink-0"
            loading="eager"
          />
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}