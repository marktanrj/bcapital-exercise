import { ApiProperty } from '@nestjs/swagger';
import { CoreMessage } from 'ai';
import { IsNotEmpty, IsString } from 'class-validator';

export class StreamPromptDto {
  @IsNotEmpty()
  @ApiProperty()
  messages: CoreMessage[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  chatId: string;
}
