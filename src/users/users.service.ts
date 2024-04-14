import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRep: Repository<User>) {}

  async create(dto: CreateUserDto) {
    try {
      const value = await this.findOneByUserName(dto.username);
      const isUsernameTaken: boolean = !!value;
      if (isUsernameTaken) {
        return false;
      }
      dto.password = bcrypt.hashSync(dto.password, 10);
      await this.userRep.save(dto);
      return true;
    } catch (e) {
      return false;
    }
  }

  findOne(id: number): Promise<User | null> {
    return this.userRep.findOneBy({ id: id })
  }

  findOneByUserName(username: string): Promise<User | null> {
    return this.userRep.findOneBy({username: username});
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRep.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRep.delete(id);
  }
}
