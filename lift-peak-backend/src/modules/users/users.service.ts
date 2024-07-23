import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const isDuplicateEmail = await this.isDuplicateField(dto.email);
    const isDuplicateUsername = await this.isDuplicateField(
      dto.username,
      'username',
    );
    if (isDuplicateEmail || isDuplicateUsername) {
      throw new ForbiddenException('Email or Username already exists');
    }

    const user = new User();

    user.email = dto.email;
    user.password = await bcrypt.hash(dto.password, 10);
    user.username = dto.username;

    return await this.usersRepository.save(user);
  }

  async findOneByCondition(conditions: { [key: string]: any }): Promise<User> {
    return await this.usersRepository.findOne({ where: conditions });
  }

  async isDuplicateField(
    value: string | number,
    field: keyof User = 'email',
  ): Promise<boolean> {
    const isDuplicate = await this.usersRepository.findOne({
      where: [{ [field]: value }],
    });
    if (isDuplicate) {
      return true;
    }

    return false;
  }
}
