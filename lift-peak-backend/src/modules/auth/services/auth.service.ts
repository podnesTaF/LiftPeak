import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByCondition({ email });
    const isPasswordMatching = await bcrypt.compare(pass, user?.password);
    if (user && isPasswordMatching) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Partial<User>) {
    const payload = { username: user.username, email: user.email, id: user.id };
    return {
      ...payload,
      token: this.jwtService.sign(payload),
    };
  }

  async register(dto: CreateUserDto) {
    const userData = await this.usersService.create({
      ...dto,
    });

    return this.login(userData);
  }
}
