import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { Request } from 'express';
import { SessionGuard } from './auth.guard';
import { User } from '../user/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto, @Req() req: Request) {
    const userInfo = await this.authService.register(registerDto);

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
    await new Promise((resolve) => req.session.destroy(resolve));
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.OK)
  async me(@User() user) {
    return {
      userId: user.id,
      username: user.username
    };
  }
}
