import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { SessionGuard } from '../auth/auth.guard';
import { MessageService } from './message.service';
import { MessageQueryDto } from './dto/message-query.dto';

@Controller('messages')
@UseGuards(SessionGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':chatId/messages')
  @HttpCode(HttpStatus.OK)
  async getMessages(
    @Param('chatId') chatId: string,
    @Query() query: MessageQueryDto
  ) {
    return this.messageService.getRecentMessages(chatId, query.limit, query.offset);
  }
}