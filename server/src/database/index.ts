import { ChatTable } from "../chat/chat.model";
import { MessageTable } from "../message/message.model";
import { UserTable } from "../user/user.model";

export interface Database {
  user: UserTable;
  chat: ChatTable;
  message: MessageTable;
}
