import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SessionGuard } from '../auth/auth.guard';
import { User } from '../user/user.decorator';
import { GetChatsQueryDto } from './dto/get-chats-query.dto';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatTitleDto } from './dto/update-chat-title.dto';

@Controller('chats')
@UseGuards(SessionGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getRecentChats(
    @User() user,
    @Query() query: GetChatsQueryDto
  ) {
    const parsedLimit = query.limit || 30;
    return this.chatService.getRecentChats(user.id, parsedLimit);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createChat(@User() user, @Body() createChatDto: CreateChatDto) {
    return this.chatService.createChat(user.id, createChatDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteChat(@User() user, @Param('id') chatId: string) {
    await this.chatService.deleteChat(user.id, chatId);
  }

  @Patch(':id/title')
  @HttpCode(HttpStatus.OK)
  async updateChatTitle(
    @User() user,
    @Param('id') chatId: string,
    @Body() updateChatTitleDto: UpdateChatTitleDto,
  ) {
    return this.chatService.updateChatTitle(user.id, chatId, updateChatTitleDto);
  }
}