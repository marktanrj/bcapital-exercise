import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  password: string;
}
