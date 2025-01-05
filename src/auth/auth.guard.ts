import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();

    try {
      const token = request.headers.authorization?.split(' ')[1];
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;

      if (!requiredRoles) return true;
      return requiredRoles.includes(payload.role);
    } catch {
      return false;
    }
  }
}
