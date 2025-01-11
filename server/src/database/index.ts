import { ChatTable } from '../modules/chat/chat.model';
import { MessageTable } from '../modules/message/message.model';
import { UserTable } from '../modules/user/user.model';

export interface Database {
  user: UserTable;
  chat: ChatTable;
  message: MessageTable;
}
