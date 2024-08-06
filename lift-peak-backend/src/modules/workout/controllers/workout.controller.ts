import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import {
  AuthenticatedUser,
  GetUser,
} from 'src/modules/users/decorators/user.decorator';
import { CreateWorkoutDto } from '../dto/create-workout.dto';
import { WorkoutService } from '../services/workout.service';

@Controller('workouts')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createWorkout(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: CreateWorkoutDto,
  ) {
    return this.workoutService.createWorkout(user, dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getWorkout(@Param('id') workoutId: number) {
    return this.workoutService.getWorkout(workoutId);
  }
}
