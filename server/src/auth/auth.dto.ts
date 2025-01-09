import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
  @Transform(({ value }) => value.toLowerCase())
  username: string;
  password: string;
}

export class LoginDto {
  email: string;
  password: string;
}