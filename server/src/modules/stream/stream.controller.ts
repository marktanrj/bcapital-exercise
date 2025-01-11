import { Controller, Body, Post, UseGuards, Res } from '@nestjs/common';
import { StreamService } from './stream.service';
import { SessionGuard } from '../auth/auth.guard';
import { StreamPromptDto } from './dto/stream-prompt.dto';

@Controller('stream')
@UseGuards(SessionGuard)
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Post('chat')
  async chat(@Res() res: Response, @Body() streamPromptDto: StreamPromptDto) {
    try {
      const result = await this.streamService.streamResponse(streamPromptDto);
      return result.pipeDataStreamToResponse(res as any);
    } catch (error) {
      console.error('Error in stream chat endpoint:', error);
      throw error;
    }
  }
}
