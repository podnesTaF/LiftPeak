import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
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

  @Post('/:id/media')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'media', maxCount: 8 }]))
  async uploadMedia(
    @Param('id') workoutId: number,
    @UploadedFiles()
    files: {
      media?: Express.Multer.File[];
    },
  ) {
    return this.workoutService.uploadWorkoutMedia(workoutId, files.media);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getWorkouts(@GetUser() user: AuthenticatedUser) {
    return this.workoutService.getWorkouts(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getWorkout(
    @Param('id') workoutId: number,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.workoutService.getWorkout(workoutId, user.id);
  }

  @Get('/routine/list')
  @UseGuards(JwtAuthGuard)
  async getRoutineList() {
    return this.workoutService.getRoutineList();
  }
}
