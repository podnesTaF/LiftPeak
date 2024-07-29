import { Controller } from '@nestjs/common';
import { WorkoutLogService } from './workout-log.service';

@Controller('workout-log')
export class WorkoutLogController {
  constructor(private readonly workoutLogService: WorkoutLogService) {}
}
