import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateChatDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @ApiProperty()
  title: string;
}