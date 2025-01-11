import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Request } from 'express';
import { SessionGuard } from './auth.guard';
import { User } from '../user/user.decorator';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: SignUpDto, @Req() req: Request) {
    const userInfo = await this.authService.signup(signUpDto);

    req.session.userId = userInfo.id;
    req.session.username = userInfo.username;

    return userInfo;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const userInfo = await this.authService.login(loginDto);

    req.session.userId = userInfo.id;
    req.session.username = userInfo.username;

    return userInfo;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    try {
      await new Promise<void>((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) reject(err);
          resolve();
        });
      });
      
      // Clear the cookie by setting it to expire
      const isProd = process.env.NODE_ENV === 'production';
      req.res.clearCookie('sessionId', {
        path: '/',
        domain: isProd ? this.configService.get('sessionDomain') : undefined,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax'
      });
      
      return { message: 'Logged out successfully' };
    } catch (error) {
      this.logger.error('Logout failed', error);
      throw error;
    }
  }

  @Get('me')
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.OK)
  async me(@User() user) {
    return {
      userId: user.id,
      username: user.username,
    };
  }
}
