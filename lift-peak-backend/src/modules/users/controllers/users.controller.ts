import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthenticatedUser, GetUser } from '../decorators/user.decorator';
import { AddGymDto } from '../dto/create-gym.dto';
import { User } from '../entities/user.entity';
import { UserGymService } from '../services/gym.service';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly gymService: UserGymService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/general')
  async profile(@GetUser() user: AuthenticatedUser) {
    return this.usersService.findOneWithFollowings(user.id);
  }

  @Get('/exists/:value')
  async checkIfUserExists(
    @Param('value') value: any,
    @Query('field') field?: keyof User,
  ) {
    return this.usersService.isDuplicateField(value, field);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async info(@GetUser() user: AuthenticatedUser, @Param('id') id: number) {
    return this.usersService.getUserInfo(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/gyms')
  async addGymToUser(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: AddGymDto[],
  ) {
    return this.gymService.addGymToUser(user.id, dto);
  }
}
