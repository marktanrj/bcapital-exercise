import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Kysely, ParseJSONResultsPlugin, PostgresDialect, sql } from 'kysely';
import { Pool } from 'pg';
import { Database } from '../database';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DbService implements OnModuleInit {
  private readonly logger = new Logger(DbService.name);

  db: Kysely<Database>;

  constructor(private readonly configService: ConfigService) {
    this.setUpDatabase();
  }

  async onModuleInit() {
    this.checkExtensions();
  }

  setUpDatabase() {
    this.logger.log('Connecting to database');

    const dbConfig = this.configService.getOrThrow('database');
    const poolConfig = dbConfig.url 
      ? { connectionString: dbConfig.url }
      : {
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.user,
          password: dbConfig.password,
          database: dbConfig.database,
        };

    const dialect = new PostgresDialect({
      pool: new Pool(poolConfig),
    });

    this.db = new Kysely<Database>({
      dialect,
      plugins: [new ParseJSONResultsPlugin()],
    }).withSchema('public');
  }

  async checkExtensions() {
    try {
      await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.execute(this.db);
      await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`.execute(this.db);
      this.logger.log('Extensions checked');
    } catch (error) {
      this.logger.error('Error ensuring extension:', error);
    }
  }
}
