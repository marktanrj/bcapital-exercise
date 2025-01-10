import { Module } from '@nestjs/common';
import { MessageModule } from '../message/message.module';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';
import { LLMModule } from '../../llm/llm.module';
import { ChatModule } from '../chat/chat.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [MessageModule, LLMModule, ChatModule, UserModule],
  providers: [StreamService],
  controllers: [StreamController],
})
export class StreamModule {}
