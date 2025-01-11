import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

export interface MessageTable {
  id: string;
  chatId: string;
  role: 'system' | 'user' | 'assistant' | 'data';
  content: string;
  tokensUsed: number;
  createdAt: ColumnType<Date, Date | null, Date | null>;
}

export type Message = Selectable<MessageTable>;
export type NewMessage = Insertable<MessageTable>;
export type UpdateMessage = Updateable<MessageTable>;
