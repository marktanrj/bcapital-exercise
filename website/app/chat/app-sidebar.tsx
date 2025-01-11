'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { Button } from "../../components/ui/button"
import { useLogout } from "../../hooks/auth/use-logout";
import { Chat } from "../../api/chat-api";
import { chatsQueryKey, useChats } from "../../hooks/chat";
import { useParams, useRouter } from "next/navigation";
import { ChatMenuButton } from "./chat-menu-button";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function AppSidebar() {
  const queryClient = useQueryClient();
  const { logout } = useLogout();
  const router = useRouter();
  const params = useParams();
  const chatId = params?.id;

  const { 
    data: chats, 
    isLoading, 
  } = useChats(30);

  // refresh chats if chatId changes, since new chat is added
  useEffect(() => {
    if (chatId) {
      queryClient.refetchQueries({ queryKey: chatsQueryKey });
    }
  }, [chatId, queryClient]);

  const handleNewChat = () => {
    router.push('/chat');
  };

  const showLoadingState = isLoading && !(chats || [])?.length;
  const showEmptyState = !isLoading && chats?.length === 0;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <Button onClick={handleNewChat}>
            New Chat
          </Button>
          
          <SidebarGroupLabel className="mt-3">
            <span>Recent Chats</span>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {showLoadingState ? (
                <div className="flex items-center justify-center py-4">
                  loading..
                </div>
              ) : showEmptyState ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No chats yet
                </div>
              ) : (
                chats?.map((chat: Chat) => (
                  <ChatMenuButton
                    key={chat.id}
                    chat={chat}
                    currentId={params.id}
                  />
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button className="w-full" onClick={logout}>
          Log Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}