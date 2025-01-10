import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

export interface ChatTable {
  id: string;
  userId: string;
  title: string;
  lastActivityAt: ColumnType<Date, Date | null, Date | null>;
  createdAt: ColumnType<Date, Date | null, Date | null>;
}

export type Chat = Selectable<ChatTable>;
export type NewChat = Insertable<ChatTable>;
export type UpdateChat = Updateable<ChatTable>;
