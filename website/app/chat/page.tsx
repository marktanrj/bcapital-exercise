'use client'

import Prompt from "./prompt";

export default function Chat() {
  // const getNewChatTitle = () => {
  //   return `New Chat-${format(new Date(), 'yyMMdd-HHmmss')}`;
  // }

  // const handleNewChat = () => {
  //   createChat(
  //     { title: getNewChatTitle() },
  //     {
  //       onSuccess: (newChat) => {
  //         queryClient.invalidateQueries({ queryKey: ['chats', 'list'] }); 
  //         router.push(`/chat/${newChat.id}`);
  //       },
  //     }
  //   );
  // };

  return (
    <div className="w-full p-5 flex flex-col items-center justify-center min-h-screen">
      <Prompt />
    </div>
  );
}
