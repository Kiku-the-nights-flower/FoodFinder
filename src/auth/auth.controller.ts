import { BadRequestException, Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private auth: AuthService,
  ) {
    this.userService = userService;
    this.auth = auth;
  }

  @Post('/register')
  async createUser(@Body() user: User): Promise<string> {
    if (!user) {
      throw new BadRequestException();
    }
    if (user.username == null || user.password == null || user.email == null) {
      throw new BadRequestException();
    } else {
      return this.userService.create(user).then(() => {
          return 'User created';
        },
        (err: BadRequestException) => {
          throw err;
        },
      );
    }
  }

  @Post('/login')
  async login(@Body() user: {username: string, password: string}): Promise<{ token: string } | null> {
    if (!user) {
      throw new BadRequestException();
    }

    if (!user.username || !user.password) {
      throw new BadRequestException();
    }
    const token = await this.auth.signIn(user.username, user.password);
    if (token) {
      return token;
    } else {
      throw new UnauthorizedException();
    }
  }
}
