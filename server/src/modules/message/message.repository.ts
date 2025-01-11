import { Injectable } from '@nestjs/common';
import { DbService } from '../../database/db.service';
import { NewMessage } from './message.model';

@Injectable()
export class MessageRepository {
  constructor(private readonly dbService: DbService) {}

  async create(data: NewMessage) {
    return await this.dbService.db
      .insertInto('message')
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async getRecentByChatId(chatId: string, limit: number, offset: number) {
    return await this.dbService.db
      .selectFrom('message')
      .where('chatId', '=', chatId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset(offset)
      .selectAll()
      .execute()
      .then((messages) => messages.reverse()); // reverse in memory to get ascending order
  }
}
