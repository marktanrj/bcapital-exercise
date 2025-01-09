import { Kysely, sql } from 'kysely';
import { UserRole } from '../user/user.model';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.execute(db);
  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`.execute(db);

  await db.schema
    .createTable('user')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
    .addColumn('username', 'varchar(50)', (col) => col.notNull())
    .addColumn('email', 'varchar(254)', (col) => col.notNull())
    .addColumn('password', 'varchar(60)', (col) => col.notNull())
    .addColumn('role', 'varchar(20)', (col) => col.notNull().defaultTo(UserRole.GENERAL))
    .addColumn('lastActiveDate', 'timestamp', (col) => col.notNull())
    .addColumn('updatedAt', 'timestamp', (col) => {
      return col.defaultTo(sql`now()`).notNull();
    })
    .addColumn('createdAt', 'timestamp', (col) => {
      return col.defaultTo(sql`now()`).notNull();
    })
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('user').execute();
}
