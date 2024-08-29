import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config as evnconfig } from 'dotenv';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import { ExerciseMedia } from 'src/modules/exercise/entity/exercise-media.entity';
import { ExerciseTarget } from 'src/modules/exercise/entity/exercise-target.entity';
import { Exercise } from 'src/modules/exercise/entity/exercise.entity';
import { Instruction } from 'src/modules/exercise/entity/instruction.entity';
import { GroupMember } from 'src/modules/group/entities/group-member.entity';
import { GroupPost } from 'src/modules/group/entities/group-post.entity';
import { Group } from 'src/modules/group/entities/group.entity';
import { PostContent } from 'src/modules/group/entities/post-content.entity';
import { Like } from 'src/modules/like/entities/like.entity';
import { Media } from 'src/modules/media/entity/media.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { Target } from 'src/modules/target/entities/target.entity';
import { Gym } from 'src/modules/users/entities/gym.entity';
import { Profile } from 'src/modules/users/entities/profile.entity';
import { SocialMediaLink } from 'src/modules/users/entities/social-media.entity';
import { UserFollower } from 'src/modules/users/entities/user-follower.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { ExerciseLog } from 'src/modules/workout-log/entities/exercise-log.entity';
import { Set } from 'src/modules/workout-log/entities/set.entity';
import { WorkoutLog } from 'src/modules/workout-log/entities/workout-log.entity';
import { RoutineSave } from 'src/modules/workout/entities/routine-save.entity';
import { WorkoutMedia } from 'src/modules/workout/entities/workout-media.entity';
import { Workout } from 'src/modules/workout/entities/workout.entity';

evnconfig();

export const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQLHOST || 'localhost',
  port: parseInt(process.env.MYSQLPORT, 10),
  username: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  entities: [
    User,
    Role,
    Profile,
    Workout,
    Like,
    Comment,
    Media,
    WorkoutLog,
    WorkoutMedia,
    RoutineSave,
    Exercise,
    ExerciseMedia,
    Instruction,
    Target,
    UserFollower,
    Group,
    ExerciseTarget,
    GroupMember,
    WorkoutLog,
    ExerciseLog,
    Set,
    Gym,
    SocialMediaLink,
    GroupPost,
    PostContent,
  ],
  synchronize: true,
};
