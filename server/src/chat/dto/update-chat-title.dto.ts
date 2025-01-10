import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class UpdateChatTitleDto {
  @IsString()
  @MinLength(3)
  @MinLength(255)
  @ApiProperty()
  title: string;
}