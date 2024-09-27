import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddGymDto } from '../dto/create-gym.dto';
import { Gym } from '../entities/gym.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class UserGymService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Gym)
    private gymRepository: Repository<Gym>,
  ) {}

  async addGymToUser(userId: number, gyms: (AddGymDto | Gym)[]): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['gyms'],
    });

    for (const gymData of gyms) {
      const gym = await this.gymRepository.findOne({
        where: { name: gymData.name, address: gymData.address },
      });

      if (!gym) {
        const newGym = this.gymRepository.create(gymData);
        await this.gymRepository.save(newGym);
        user.gyms.push(newGym);
      } else {
        user.gyms.push(gym);
      }
    }

    return this.userRepository.save(user);
  }

  async updateUserGyms(userId: number, gyms: (AddGymDto | Gym)[]) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['gyms'],
    });

    user.gyms = [];

    await this.userRepository.save(user);

    return await this.addGymToUser(user.id, gyms);
  }
}
