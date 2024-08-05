import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  AuthenticatedUser,
  GetUser,
} from '../../users/decorators/user.decorator';
import { CreateWorkoutLogDto } from '../dto/create-workout-log.dto';
import { WorkoutLogService } from '../services/workout-log.service';

@Controller('workout-log')
export class WorkoutLogController {
  constructor(private readonly workoutLogService: WorkoutLogService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createWorkoutLog(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: CreateWorkoutLogDto,
  ) {
    return this.workoutLogService.createWorkoutLog(user, dto);
  }
}
