import { Controller, Sse, Body, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { StreamService } from './stream.service';
import { ChatStreamDto } from './dto/chat-stream.dto';

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Post('chat')
  @Sse()
  streamChat(
    @Body() chatStreamDto: ChatStreamDto
  ): Observable<any> {
    return this.streamService.createChatStream(chatStreamDto);
  }
}