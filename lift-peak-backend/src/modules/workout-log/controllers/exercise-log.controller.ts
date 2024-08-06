import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import {
  AuthenticatedUser,
  GetUser,
} from 'src/modules/users/decorators/user.decorator';
import { CreateExerciseLogDto } from '../dto/create-exercise-log.dto';
import { ExerciseLogService } from '../services/exercise-log.service';

@Controller('/workout-log/:id/exercises')
export class ExerciseLogController {
  constructor(private readonly exerciseLogService: ExerciseLogService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addWorkoutExercises(
    @GetUser() user: AuthenticatedUser,
    @Param('id') workoutLogId: number,
    @Body() dto: CreateExerciseLogDto[],
  ) {
    return this.exerciseLogService.addWorkoutExercises(user, workoutLogId, dto);
  }
}
