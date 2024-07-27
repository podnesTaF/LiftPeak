import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config as evnconfig } from 'dotenv';
import { Media } from 'src/modules/media/entity/media.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { Profile } from 'src/modules/users/entities/profile.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Logger } from 'src/modules/workout/entities/logger.entity';
import { RoutineSave } from 'src/modules/workout/entities/routine-save.entity';
import { WorkoutComment } from 'src/modules/workout/entities/workout-comment.entity';
import { WorkoutLike } from 'src/modules/workout/entities/workout-like.entity';
import { WorkoutMedia } from 'src/modules/workout/entities/workout-media.entity';
import { Workout } from 'src/modules/workout/entities/workout.entity';

evnconfig();

export const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQLHOST || 'localhost',
  port: parseInt(process.env.MYSQLPORT, 10) || 3306,
  username: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  entities: [
    User,
    Role,
    Profile,
    Workout,
    WorkoutLike,
    WorkoutComment,
    Media,
    Logger,
    WorkoutMedia,
    RoutineSave,
  ],
  synchronize: true,
};
