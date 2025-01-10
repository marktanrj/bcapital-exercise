import { Module } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';
import { DatabaseModule } from '../../database/db.module';
import { MessageController } from './message.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule],
  providers: [MessageController, MessageRepository, MessageService],
  exports: [MessageService],
})
export class MessageModule {}
