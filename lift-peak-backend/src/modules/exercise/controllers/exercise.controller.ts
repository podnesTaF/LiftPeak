import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
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
import { CreateExerciseDto } from '../dto/create-exercise.dto';
import { ExerciseService } from '../services/exercise.service';

@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchExercises(
    @GetUser() user: AuthenticatedUser,
    @Query() query?: { value?: string; id?: number; muscles?: string },
  ) {
    let muscleIds = [];
    if (query.muscles) {
      muscleIds = query.muscles.split(',').map((id) => +id);
    }

    return this.exerciseService.searchExercises({
      value: query.value,
      id: query?.id,
      userId: user?.id,
      muscleIds,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createExercise(@Body() dto: CreateExerciseDto) {
    return this.exerciseService.createExercise(dto);
  }

  @Post('/:id/media')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'media', maxCount: 10 },
      {
        name: 'preview',
        maxCount: 1,
      },
    ]),
  )
  async addMedia(
    @Param('id') id: number,
    @UploadedFiles()
    files: {
      media?: Express.Multer.File[];
      preview?: Express.Multer.File[];
    },
  ) {
    return this.exerciseService.addMedia(id, files);
  }

  @Get(':id/alternatives')
  async getAlternativeExercises(
    @Param('id') id: number,
    @Query('shortForm') shortForm?: boolean,
  ) {
    return this.exerciseService.getAlternativeExercises(id, shortForm);
  }

  @Get(':id')
  async getExercise(@Param('id') id: number) {
    return this.exerciseService.getFullExercise(id);
  }

  @Get('/history/:exerciseId')
  async getExerciseLogHistory(@Param('exerciseId') exerciseId: number) {
    return this.exerciseService.getExerciseLogHistory(exerciseId);
  }
}
