import { Controller } from '@nestjs/common';
import { WorkoutService } from '../services/workout.service';

@Controller('workout')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}
}
