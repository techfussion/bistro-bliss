import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('No user found in request');
    }

    if (!user.role) { // user.roles
      throw new ForbiddenException('User has no roles assigned');
    }

    console.log('User roles:', user.roles);
    console.log('Required roles:', requiredRoles);

    // const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    const hasRole = requiredRoles.some((role) => user.role === role);
    
    if (!hasRole) {
      throw new ForbiddenException(
        `User roles (${user.roles}) do not match required roles (${requiredRoles})`
      );
    }

    return true;
  }
}