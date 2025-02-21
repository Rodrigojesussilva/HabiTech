import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

interface StructureProps {
	children?: React.ReactNode;
  }
  
  export default function Structure({ children }: StructureProps) {
  return (
    <SidebarProvider>
      <AppSidebar className="inset-y-12" />
      <SidebarInset className="inset-y-12">
            <SidebarTrigger className="fixed  ml-2 z-10 " />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
			{children}
      </SidebarInset>
    </SidebarProvider>
  )
}
