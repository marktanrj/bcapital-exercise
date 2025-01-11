import { CoreMessage, streamText } from 'ai';

export type StreamTextMessage = Parameters<typeof streamText>[0]['messages'];
export type StreamTextOnFinish = Parameters<typeof streamText>[0]['onFinish'];
export abstract class LLMClient {
  abstract createMessageStream(
    messages: CoreMessage[],
    onFinish?: StreamTextOnFinish,
  ): ReturnType<typeof streamText>;
}
