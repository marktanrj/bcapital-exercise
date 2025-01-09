import { promises as fs } from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { FileMigrationProvider, Kysely, Migrator, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

// load only in non-production environments
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env' });
  const envPath = `.env.${process.env.NODE_ENV || 'development'}`;
  dotenv.config({ path: envPath });
}

async function migrateToLatest() {
  const migrationFolderPath = path.join(__dirname, '..', 'migrations');

  console.log(`Rolling back migrations on ${process.env.NODE_ENV}..`);
  const database = new Kysely({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
      }),
    }),
  });

  const migrator = new Migrator({
    db: database,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: migrationFolderPath,
    }),
  });

  const { error, results } = await migrator.migrateDown();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was rolled back successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to rollback migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to rollback migration');
    console.error(error);
    process.exit(1);
  }

  await database.destroy();
}

migrateToLatest();
