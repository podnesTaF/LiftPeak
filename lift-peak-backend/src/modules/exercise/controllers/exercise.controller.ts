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
import { CreateExerciseDto } from '../dto/create-exercise.dto';
import { ExerciseService } from '../services/exercise.service';

@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get('search')
  async searchExercises(@Query() query?: { value?: string; id?: number }) {
    return this.exerciseService.searchExercises(query.value, query?.id);
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

  @Get(':id')
  async getExercise(@Param('id') id: number) {
    return this.exerciseService.getFullExercise(id);
  }
}
