import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { LLMClient } from '../../llm/llm-client.abstract';
import { MessageService } from '../message/message.service';
import { StreamPromptDto } from './dto/stream-prompt.dto';
import { MessageRole } from '../message/message.model';
import { ChatService } from '../chat/chat.service';
import { User } from '../user/user.model';

@Injectable()
export class StreamService {
  private messageSubjects: Map<string, Subject<string>> = new Map();

  constructor(
    private readonly llmClient: LLMClient,
    private readonly messageService: MessageService,
    private readonly chatService: ChatService,
  ) {}

  getMessageSubject(chatId: string): Subject<string> {
    if (!this.messageSubjects.has(chatId)) {
      this.messageSubjects.set(chatId, new Subject<string>());
    }
    return this.messageSubjects.get(chatId)!;
  }


  async streamResponse(chatId: string, message: string) {
    await this.messageService.createMessage({
      chatId,
      role: MessageRole.USER,
      content: message,
      tokensUsed: 0,
    });

    const messageHistory = await this.messageService.getRecentMessagesFormattedForLLM(
      chatId, 
      15, 
      0
    );

    const messageSubject = this.getMessageSubject(chatId);

    const stream = await this.llmClient.createMessageStream({
      messages: messageHistory,
    })

    let fullResponse = '';
    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta') {
        fullResponse += chunk.delta.text;
        messageSubject.next(chunk.delta.text);
      }
    }

    await this.messageService.createMessage({
      chatId,
      role: MessageRole.ASSISTANT,
      content: fullResponse,
      tokensUsed: 0,
    })

    // signal completion
    messageSubject.next('[DONE]');
  }
}