import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ChatStreamDto {
  @IsString()
  @ApiProperty()
  chatId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  message: string;
}