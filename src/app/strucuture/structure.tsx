import { AppSidebar } from "@/components/navigation/sidebar/Sidebar"
import { Separator } from "@/components/ui/separator"
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
    <SidebarProvider >
      <AppSidebar  />
      <SidebarInset className="inset-y-14">
        <SidebarTrigger className="fixed ml-2 z-10" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
		    {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
