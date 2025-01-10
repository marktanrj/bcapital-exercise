import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { LoginDto, SignUpDto } from './auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private userRepository: UserRepository) {}

  async signup(signUp: SignUpDto) {
    try {
      const existingUser = await this.userRepository.findByUsername(signUp.username);
  
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }
  
      const hashedPassword = await bcrypt.hash(signUp.password, 10);
  
      const user = await this.userRepository.create({
        username: signUp.username,
        hashedPassword,
      });
  
      return {
        id: user.id,
        username: user.username
      };
    } catch (error) {
      this.logger.error('Registration error:', error);
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userRepository.findByUsername(loginDto.username);
      
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.hashedPassword
      );
  
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      return {
        id: user.id,
        username: user.username
      };
    } catch (error) {
      this.logger.error('Login error:', error);
      throw error;
    }
  }
}