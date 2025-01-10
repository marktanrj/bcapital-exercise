import { Module } from '@nestjs/common';
import { MessageModule } from '../message/message.module';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';
import { LLMModule } from '../../llm/llm.module';

@Module({
  imports: [MessageModule, LLMModule],
  providers: [StreamController, StreamService],
  exports: [],
})
export class StreamModule {}
