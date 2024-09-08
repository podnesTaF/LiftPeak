import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Role, RoleEnum } from 'src/modules/role/entities/role.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
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

    user.role = await this.roleRepository.findOne({
      where: { name: RoleEnum.USER },
    });

    return await this.usersRepository.save(user);
  }

  async findOneWithFollowings(id: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: { id },
      relations: ['following', 'following.followed.profile'],
    });
  }

  async findOneByCondition(conditions: { [key: string]: any }): Promise<User> {
    return await this.usersRepository.findOne({
      where: conditions,
      relations: ['role'],
    });
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

  async getUserInfo(
    id: number,
    authedId: number,
  ): Promise<
    User & {
      followersCount: number;
      followingsCount: number;
      isFollowing: boolean;
    }
  > {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['following', 'followers', 'profile.socialMediaLinks', 'gyms'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      followersCount: user.followers?.length,
      followingsCount: user.following?.length,
      isFollowing: !!user.followers.find((f) => f.followerId === authedId),
    };
  }

  async update(id: number, data: any) {
    return await this.usersRepository.update({ id }, data);
  }
}
