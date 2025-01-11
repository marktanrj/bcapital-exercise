import { Injectable } from '@nestjs/common';
import { LLMClient } from '../../llm/llm-client.abstract';
import { MessageService } from '../message/message.service';
import { StreamPromptDto } from './dto/stream-prompt.dto';

@Injectable()
export class StreamService {
  constructor(
    private readonly llmClient: LLMClient,
    private readonly messageService: MessageService,
  ) {}

  async streamResponse(streamPromptDto: StreamPromptDto) {
    await this.messageService.createMessage({
      chatId: streamPromptDto.chatId,
      role: 'user',
      content: streamPromptDto.messages[streamPromptDto.messages.length - 1].content as string,
      tokensUsed: 0,
    });

    const messageHistory = await this.messageService.getRecentMessagesFormattedForLLM(
      streamPromptDto.chatId,
      15,
      0,
    );

    const result = this.llmClient.createMessageStream(messageHistory as any, async (res) => {
      if (['stop', 'length', 'content-filter', 'tool-calls'].includes(res.finishReason)) {
        await this.messageService.createMessage({
          chatId: streamPromptDto.chatId,
          role: 'assistant',
          content: res.text,
          tokensUsed: res.usage.totalTokens,
        });
      }
    });

    return result;
  }
}
