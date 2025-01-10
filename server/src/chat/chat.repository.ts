import { Injectable } from '@nestjs/common';
import { DbService } from '../database/db.service';
import { NewChat, UpdateChat } from './chat.model';

@Injectable()
export class ChatRepository {
  constructor(private readonly dbService: DbService) {}

  async create(data: NewChat) {
    return await this.dbService.db
      .insertInto('chat')
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async findById(id: string) {
    return await this.dbService.db
      .selectFrom('chat')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();
  }

  async deleteById(id: string) {
    return await this.dbService.db
      .deleteFrom('chat')
      .where('id', '=', id)
      .execute();
  }

  async updateById(id: string, data: Partial<UpdateChat>) {
    return await this.dbService.db
      .updateTable('chat')
      .set(data)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async findRecentByUserId(userId: string, limit: number) {
    return await this.dbService.db
      .selectFrom('chat')
      .where('userId', '=', userId)
      .orderBy('lastActivityAt', 'desc')
      .limit(limit)
      .selectAll()
      .execute();
  }
}