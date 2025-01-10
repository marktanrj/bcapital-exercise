import Anthropic from "@anthropic-ai/sdk";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MessageDto } from "../modules/message/dto/message.dto";
import { LLMClient } from "./llm-client.abstract";

@Injectable()
export class AnthropicClient implements LLMClient {
  readonly anthropic;
  readonly model;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.model = this.configService.getOrThrow('anthropic.model');
    this.anthropic = new Anthropic({
      apiKey: this.configService.getOrThrow('anthropic.apiKey'),
    });
  }

  createMessageStream(messageDto: MessageDto) {
    return this.anthropic.messages.create({
      messages: messageDto.messages,
      model: this.model,
      max_tokens: 1024,
      stream: true,
    });
  }
}
