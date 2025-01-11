import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Transform(({ value }) => value.toLowerCase())
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  password: string;
}

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
