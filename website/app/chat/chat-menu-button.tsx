import { Chat } from "../../api/chat-api";
import { SidebarMenuItem, SidebarMenuButton } from "../../components/ui/sidebar";
import { cn } from "../../lib/utils";

interface ChatMenuButtonProps {
  chat: Chat;
  currentId: string | string[] | undefined;
}

export function ChatMenuButton({ chat, currentId: selectedId }: ChatMenuButtonProps) {
  return (
  <SidebarMenuItem key={chat.id}>
    <SidebarMenuButton
      asChild
      className={cn(
        selectedId === chat.id && "bg-slate-300"
      )}
    >
      <a href={`/chat/${chat.id}`} className="flex items-center gap-3">
        <span className="truncate">{chat.title}</span>
      </a>
    </SidebarMenuButton>
  </SidebarMenuItem>
  )
}
