import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { CreateInstructionDto } from '../dto/create-instruction.dto';
import { Exercise } from '../entity/exercise.entity';
import { Instruction } from '../entity/instruction.entity';

@Injectable()
export class InstructionService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
    @InjectRepository(Instruction)
    private readonly instructionRepository: Repository<Instruction>,
  ) {}

  async createInstructions(
    exerciseId: number,
    instructions: CreateInstructionDto[],
    queryRunner?: QueryRunner,
  ) {
    if (!exerciseId) {
      throw new Error('Exercise id is required');
    }

    const createdInstructions = instructions.map((instruction) => {
      const newInstruction = new Instruction();
      newInstruction.content = instruction.content;
      newInstruction.exerciseId = exerciseId;
      if (queryRunner) {
        return queryRunner.manager.save(Instruction, newInstruction);
      }
      return this.instructionRepository.save(newInstruction);
    });

    return Promise.all(createdInstructions);
  }

  async getInstructions(exerciseId: number) {
    return this.instructionRepository.find({ where: { exerciseId } });
  }
}
