import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseMedia } from './entity/exercise-media.entity';
import { Exercise } from './entity/exercise.entity';
import { Instruction } from './entity/instruction.entity';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise, ExerciseMedia, Instruction])],
  controllers: [ExerciseController],
  providers: [ExerciseService],
})
export class ExerciseModule {}
