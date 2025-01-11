import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LLMClient, StreamTextMessage, StreamTextOnFinish } from './llm-client.abstract';
import { AnthropicProvider, createAnthropic } from '@ai-sdk/anthropic';
import { CoreMessage, streamText } from 'ai';

@Injectable()
export class AnthropicClient implements LLMClient {
  readonly anthropic: AnthropicProvider;
  readonly model: string;

  constructor(private readonly configService: ConfigService) {
    this.model = this.configService.getOrThrow('anthropic.model');
    this.anthropic = createAnthropic({
      apiKey: this.configService.getOrThrow('anthropic.apiKey'),
    });
  }

  createMessageStream(messages: StreamTextMessage, onFinish?: StreamTextOnFinish) {
    return streamText({
      model: this.anthropic(this.model),
      messages,
      maxTokens: 1024,
      onFinish,
    });
  }
}
