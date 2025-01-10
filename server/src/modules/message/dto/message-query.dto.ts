import { Type } from "class-transformer";
import { IsNumber, Min, Max } from "class-validator";

export class MessageQueryDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number = 30;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset: number = 0;
}