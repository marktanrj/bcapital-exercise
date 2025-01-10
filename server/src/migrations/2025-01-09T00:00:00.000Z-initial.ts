import { Kysely, sql } from 'kysely';
import { UserRole } from '../user/user.model';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.execute(db);
  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`.execute(db);

  await db.schema
    .createTable('user')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
    .addColumn('username', 'varchar(50)', (col) => col.notNull())
    .addColumn('hashedPassword', 'varchar(60)', (col) => col.notNull())
    .addColumn('role', 'varchar(20)', (col) => col.notNull().defaultTo(UserRole.GENERAL))
    .addColumn('lastActiveDate', 'timestamp', (col) => col.notNull())
    .addColumn('updatedAt', 'timestamp', (col) => 
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('createdAt', 'timestamp', (col) => 
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable('chat')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
    .addColumn('userId', 'uuid', (col) => 
      col.notNull().references('user.id').onDelete('cascade')
    )
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('lastActivityAt', 'timestamp', (col) => 
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('createdAt', 'timestamp', (col) => 
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createIndex('chat_user_id_index')
    .on('chat')
    .column('userId')
    .execute();

  await db.schema
    .createIndex('chat_last_activity_index')
    .on('chat')
    .column('lastActivityAt')
    .execute();

  await db.schema
    .createTable('message')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
    .addColumn('chatId', 'uuid', (col) => 
      col.notNull().references('chat.id').onDelete('cascade')
    )
    .addColumn('role', 'varchar(20)', (col) => col.notNull())
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('tokensUsed', 'integer', (col) => col.notNull())
    .addColumn('createdAt', 'timestamp', (col) => 
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createIndex('message_chat_id_index')
    .on('message')
    .column('chatId')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('message').execute();
  await db.schema.dropTable('chat').execute();
  await db.schema.dropTable('user').execute();
}
