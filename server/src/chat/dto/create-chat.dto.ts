import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateChatDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @ApiProperty()
  title: string;
}