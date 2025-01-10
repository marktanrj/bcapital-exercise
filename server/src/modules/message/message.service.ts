import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { NewMessage } from './message.model';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(private readonly messageRepository: MessageRepository) {}

  async createMessage(messageData: NewMessage) {
    try {
      await this.messageRepository.create(messageData);
    } catch (error) {
      this.logger.error('Create message error:', error);
      throw error;
    }
  }

  async getRecentMessages(chatId: string, limit: number, offset: number) {
    try {
      const messages = await this.messageRepository.getRecentByChatId(chatId, limit, offset);

      return messages;
    } catch (error) {
      this.logger.error('Get recent messages error:', error);
      throw error;
    }
  }

  async getRecentMessagesFormattedForLLM(chatId: string, limit: number, offset: number) {
    const messages = await this.getRecentMessages(chatId, limit, offset);
    return messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));
  }
}