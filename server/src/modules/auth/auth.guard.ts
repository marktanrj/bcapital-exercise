import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserRepository } from '../user/user.repository';
import { UserSession } from './auth.type';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    if (!request.session || !this.hasUserId(request.session)) {
      throw new UnauthorizedException('Not authenticated');
    }

    try {
      const user = await this.userRepository.findById(request.session.userId);
  
      if (!user) {
        await this.destroySession(request);
        throw new UnauthorizedException('User no longer exists');
      }

      request.user = user;
      return true;
    } catch (error) {
      await this.destroySession(request);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private hasUserId(session: UserSession): boolean {
    return Boolean(session.userId);
  }

  private destroySession(request: Request): Promise<void> {
    return new Promise((resolve, reject) => {
      request.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          reject(err);
        }
        resolve();
      });
    });
  }
}