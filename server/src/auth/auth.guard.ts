import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    if (!request.session.userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    const user = await this.userRepository.findById(request.session.userId);

    if (!user) {
      request.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
        }
      });
      throw new UnauthorizedException('User no longer exists');
    }

    request.user = user;
    
    return true;
  }
}