import { Body, Controller, Post } from '@nestjs/common';
import { ConstructorService } from './constructor.service';
import { GenerateWorkoutDto } from './dto/generate-workout.dto';

@Controller('constructor')
export class ConstructorController {
  constructor(private readonly constructorService: ConstructorService) {}

  @Post('generate')
  async generateWorkout(@Body() dto: GenerateWorkoutDto) {
    return await this.constructorService.generateWorkout(dto);
  }
}
