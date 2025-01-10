import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LLMClient } from '../../llm/llm-client.abstract';
import { MessageService } from '../message/message.service';
import { ChatStreamDto } from './dto/chat-stream.dto';
import { MessageRole } from '../message/message.model';

@Injectable()
export class StreamService {
  constructor(
    private readonly llmClient: LLMClient,
    private readonly messageService: MessageService
  ) {}

  createChatStream(chatStreamDto: ChatStreamDto): Observable<any> {
    return new Observable((subscriber) => {
      const setup = async () => {
        try {
          const historicalMessages = await this.messageService.getRecentMessagesFormattedForLLM(
            chatStreamDto.chatId, 
            15, 
            0
          );

          await this.messageService.createMessage({
            chatId: chatStreamDto.chatId,
            role: MessageRole.USER,
            content: chatStreamDto.message,
            tokensUsed: 0,
          });

          const stream = this.llmClient.createMessageStream({
            messages: [
              { role: 'system', content: 'You are a helpful assistant.' },
              ...historicalMessages,
              { role: 'user', content: chatStreamDto.message },
            ]
          });

          this.handleStreamEvents(stream, subscriber, chatStreamDto.chatId);

          return stream;
        } catch (error) {
          subscriber.error(error);
        }
      };

      const streamPromise = setup();
      
      // cleanup function
      return () => {
        streamPromise.then(stream => {
          if (stream?.controller) {
            stream.controller.abort();
          }
        });
      };
    });
  }

  private handleStreamEvents(stream: any, subscriber: any, chatId: string): void {
    let llmMessage = '';

    stream.on('text', (text: string) => {
      llmMessage += text;
      subscriber.next({ data: { content: text } });
    });

    stream.on('end', async () => {
      await this.messageService.createMessage({
        chatId,
        role: MessageRole.SYSTEM,
        content: llmMessage,
        tokensUsed: 0,
      })

      subscriber.next({ data: { done: true } });
      subscriber.complete();
    });

    stream.on('error', (error: Error) => {
      subscriber.error(error);
    });
  }
}