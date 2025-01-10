import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class StreamPromptDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  message: string;
}