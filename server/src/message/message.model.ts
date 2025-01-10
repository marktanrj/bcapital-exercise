import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

enum MessageRole {
  USER = 'USER',
  SYSTEM = 'SYSTEM',
}

export interface MessageTable {
  id: string;
  chatId: string;
  role: MessageRole;
  content: string;
  tokensUsed: number;
  createdAt: ColumnType<Date, Date | null, Date | null>;
}

export type Message = Selectable<MessageTable>;
export type NewMessage = Insertable<MessageTable>;
export type UpdateMessage = Updateable<MessageTable>;
