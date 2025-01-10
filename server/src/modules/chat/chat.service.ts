import { ForbiddenException, Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { plainToInstance } from 'class-transformer';
import { ChatResponseDto } from './dto/chat-response.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatTitleDto } from './dto/update-chat-title.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly MAX_CHATS_LIMIT = 100;

  constructor(private readonly chatRepository: ChatRepository) {}

  async createChat(userId: string, createChatDto: CreateChatDto) {
    try {
      const chat = await this.chatRepository.create({
        userId,
        title: createChatDto.title,
      });

      return plainToInstance(ChatResponseDto, chat, { excludeExtraneousValues: true });
    } catch (error) {
      this.logger.error('Create chat error:', error);
      throw error;
    }
  }

  async deleteChat(userId: string, chatId: string) {
    try {
      const chat = await this.chatRepository.findById(chatId);

      if (!chat) {
        throw new NotFoundException('Chat not found');
      }

      if (chat.userId !== userId) {
        throw new ForbiddenException('You do not have permission to delete this chat');
      }

      await this.chatRepository.deleteById(chatId);
    } catch (error) {
      this.logger.error('Delete chat error:', error);
      throw error;
    }
  }

  async updateChatTitle(userId: string, chatId: string, updateChatTitleDto: UpdateChatTitleDto) {
    try {
      const chat = await this.chatRepository.findById(chatId);

      if (!chat) {
        throw new NotFoundException('Chat not found');
      }

      if (chat.userId !== userId) {
        throw new ForbiddenException('You do not have permission to update this chat');
      }

      const updatedChat = await this.chatRepository.updateById(chatId, {
        title: updateChatTitleDto.title,
        lastActivityAt: new Date(),
      });

      return plainToInstance(ChatResponseDto, updatedChat, { excludeExtraneousValues: true });
    } catch (error) {
      this.logger.error('Update chat title error:', error);
      throw error;
    }
  }

  async getRecentChats(userId: string, limit: number) {
    try {
      if (limit <= 0 || limit > this.MAX_CHATS_LIMIT) {
        throw new BadRequestException(`Limit must be between 1 and ${this.MAX_CHATS_LIMIT}`);
      }

      const chats = await this.chatRepository.findRecentByUserId(userId, limit);

      return plainToInstance(ChatResponseDto, chats, { excludeExtraneousValues: true });
    } catch (error) {
      this.logger.error('Get recent chats error:', error);
      throw error;
    }
  }
}