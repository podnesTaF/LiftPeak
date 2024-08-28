import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateTargetDto } from './dto/create-target.dto';
import { Target } from './entities/target.entity';

@Injectable()
export class TargetService {
  constructor(
    @InjectRepository(Target)
    private readonly targetRepository: Repository<Target>,
  ) {}

  async create(dto: CreateTargetDto) {
    const target = new Target();
    target.name = dto.name;
    target.formalName = dto.formalName;
    target.description = dto.description;
    target.paths = dto.paths;

    if (dto.parentId) {
      const parent = await this.targetRepository.findOne({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new Error('Parent target not found');
      }
      target.parent = parent;
    }

    const savedTarget = await this.targetRepository.save(target);

    if (dto.muscles && dto.muscles.length > 0) {
      const childTargets = dto.muscles.map(async (childDto) => {
        const childTarget = new Target();
        childTarget.name = childDto.name;
        childTarget.formalName = childDto.formalName;
        childTarget.description = childDto.description;
        childTarget.parent = savedTarget;
        childTarget.paths = childDto.paths;

        if (childDto.muscles && childDto.muscles.length > 0) {
          await this.create(childDto);
        }

        return await this.targetRepository.save(childTarget);
      });

      await Promise.all(childTargets);
    }

    return savedTarget;
  }

  async getAll() {
    return await this.targetRepository.find({
      relations: ['parent', 'muscles'],
    });
  }

  async addTargetPath(targetId: number, paths: { [key: string]: string[] }) {
    const target = await this.targetRepository.findOne({
      where: { id: targetId },
    });

    target.paths = paths;

    return await this.targetRepository.save(target);
  }

  async getBody() {
    return this.targetRepository.find({
      where: [{ paths: Not(IsNull()) }],
    });
  }
}
