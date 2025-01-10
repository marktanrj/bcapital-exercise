import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class GetChatsQueryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty()
  limit?: number;
}