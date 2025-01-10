import { Controller, Sse, Body, Post, UseGuards, Param, MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { StreamService } from './stream.service';
import { SessionGuard } from '../auth/auth.guard';
import { map } from 'rxjs/operators';
import { StreamPromptDto } from './dto/stream-prompt.dto';

@Controller('stream')
@UseGuards(SessionGuard)
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Post('chat/:chatId/prompt')
  async sendPrompt(
    @Param('chatId') chatId: string,
    @Body() streamPromptDto: StreamPromptDto,
  ) {
    await this.streamService.streamResponse(chatId, streamPromptDto.message);
    return { status: 'Streaming started' };
  }

  @Sse('chat/:chatId/events')
  events(@Param('chatId') chatId: string): Observable<MessageEvent> {
    return this.streamService.getMessageSubject(chatId).pipe(
      map((data) => ({
        data,
        id: String(Date.now()),
        type: 'message',
        retry: 15000,
      })),
    );
  }
}