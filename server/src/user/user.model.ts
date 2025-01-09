import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

export enum UserRole {
  GENERAL = 'GENERAL',
}

export interface UserTable {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  lastActiveDate: Date;
  updatedAt: ColumnType<Date, Date | null, Date | null>;
  createdAt: ColumnType<Date, Date | null, Date | null>;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UpdateUser = Updateable<UserTable>;
