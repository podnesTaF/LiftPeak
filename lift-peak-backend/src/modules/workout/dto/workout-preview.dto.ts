import { User } from 'src/modules/users/entities/user.entity';

export interface IWorkoutPreview {
  id: number;
  title: string;
  exercises: string[];
  sets: number;
  user: Partial<User>;
}
