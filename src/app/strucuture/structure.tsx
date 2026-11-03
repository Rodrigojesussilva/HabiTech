import { AppSidebar } from "@/components/navigation/sidebar/Sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

interface ContentControllerProps {
	children?: React.ReactNode;
}
  
export default function ContentController({ children }: ContentControllerProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <div className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-2 border-b border-blue-100 bg-white/95 px-3 backdrop-blur">
          <SidebarTrigger
            aria-label="Abrir ou fechar os formulários cadastrados"
            className="size-9 rounded-lg border border-blue-100 bg-white text-blue-800 shadow-sm hover:bg-blue-50 hover:text-blue-900"
          />
          <span className="text-sm font-semibold text-slate-700">Formulários cadastrados</span>
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
