import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseTarget } from '../exercise/entity/exercise-target.entity';
import { Exercise } from '../exercise/entity/exercise.entity';
import { ConstructorController } from './constructor.controller';
import { ConstructorService } from './constructor.service';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise, ExerciseTarget])],
  controllers: [ConstructorController],
  providers: [ConstructorService],
})
export class ConstructorModule {}
