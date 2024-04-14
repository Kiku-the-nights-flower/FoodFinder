import {CanActivate, ExecutionContext, Injectable, UnauthorizedException,} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Request} from 'express';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';


/**
 * Usage:
 * import { AuthGuard } from './auth.guard';
 * @UseGuards(AuthGuard)
 * @AnyHttpMethod()
 * yourMethod(@Request() req <-- Very fucking important, otherwise the auth guard does not WORK) {
 *  //code here
 * }
 * */
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly jwtSecret = 'VerySecretKey';

  constructor(
    private jwtService: JwtService,
    private auth: AuthService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.get<boolean>('skipAuth', context.getHandler());

    if (skipAuth) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      if (this.auth.isTokenInvalid(token)) {
        return false;
      }
      request['user'] = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.jwtSecret
        }
      );
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
