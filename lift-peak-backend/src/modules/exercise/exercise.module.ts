import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipment } from '../equipment/entities/equipment.entity';
import { FileService } from '../file/file.service';
import { ExerciseLog } from '../workout-log/entities/exercise-log.entity';
import { ExerciseController } from './controllers/exercise.controller';
import { InstructionController } from './controllers/instruction.controller';
import { ExerciseMedia } from './entity/exercise-media.entity';
import { ExerciseTarget } from './entity/exercise-target.entity';
import { Exercise } from './entity/exercise.entity';
import { Instruction } from './entity/instruction.entity';
import { ExerciseService } from './services/exercise.service';
import { InstructionService } from './services/instruction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Exercise,
      ExerciseMedia,
      Instruction,
      ExerciseLog,
      ExerciseTarget,
      Equipment,
    ]),
  ],
  controllers: [ExerciseController, InstructionController],
  providers: [ExerciseService, InstructionService, FileService],
})
export class ExerciseModule {}
