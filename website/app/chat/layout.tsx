import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar";
import { ChatProvider } from "../../providers/chat-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ChatProvider>
        <AppSidebar />
        <div className="w-full">
          <SidebarTrigger />
          {children}
        </div>
      </ChatProvider>
    </SidebarProvider>
  )
}