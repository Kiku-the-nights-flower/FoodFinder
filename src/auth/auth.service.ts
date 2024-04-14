import { Injectable, UnauthorizedException } from '@nestjs/common';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private invalidatedTokens: string[] = [];

  constructor(
    @InjectRepository(User) private readonly userRep: Repository<User>,
    private jwtService: JwtService,
  ) {
    this.jwtService = jwtService;
  }

  /**
   * @param username - the username of the user
   * @param pass - plaintext password of the user
   *
   * function hashes the password and compares it to the database using bcrypt
   * if the password is correct, return the user encoded in a jwt token, only username id
   * said fckit async is on
   * */
  async signIn(username: string, pass: string) {
    const user = await this.userRep.findOne({
      where: { username: username },
      select: ['id', 'username', 'password'],
    });

    if (user == null) {
      throw new UnauthorizedException();
    }

    const isValid = await bcrypt.compare(pass, user.password);
    if (isValid == false) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id, username: user.username };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  async logOut(token: string) {
    this.invalidatedTokens.push(token);
  }

  isTokenInvalid(token: string) {
    return this.invalidatedTokens.includes(token);
  }
}
