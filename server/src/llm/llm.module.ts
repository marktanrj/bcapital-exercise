import { Module } from '@nestjs/common';
import { AnthropicClient } from './anthropic.client';
import { LLMClient } from './llm-client.abstract';

@Module({
  providers: [{
    provide: LLMClient,
    useClass: AnthropicClient
  }],
  exports: [LLMClient]
})
export class LLMModule {}
