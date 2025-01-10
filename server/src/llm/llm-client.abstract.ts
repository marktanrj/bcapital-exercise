import { MessageDto } from "../modules/message/dto/message.dto";

export abstract class LLMClient {
  abstract createMessageStream(messages: MessageDto): any;
}