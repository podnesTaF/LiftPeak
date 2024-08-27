import { GroupPost } from 'src/modules/group/entities/group-post.entity';
import { Group } from 'src/modules/group/entities/group.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { RoutineSave } from 'src/modules/workout/entities/routine-save.entity';
import { WorkoutComment } from 'src/modules/workout/entities/workout-comment.entity';
import { WorkoutLike } from 'src/modules/workout/entities/workout-like.entity';
import { Workout } from 'src/modules/workout/entities/workout.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Gym } from './gym.entity';
import { Profile } from './profile.entity';
import { UserFollower } from './user-follower.enitity';

@Entity()
export class User extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  roleId: number;
  @ManyToOne(() => Role, { eager: true })
  role: Role;

  @OneToOne(() => Profile, (profile) => profile.user, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  profile: Profile;

  @ManyToMany(() => Workout, (workout) => workout.routineOfUsers)
  routines: Workout[];

  @OneToMany(() => Workout, (workout) => workout.user)
  workouts: Workout[];

  @OneToMany(() => WorkoutLike, (workoutLike) => workoutLike.user)
  workoutReactions: WorkoutLike[];

  @OneToMany(() => WorkoutComment, (comment) => comment.commenter)
  commentsAsCommenter: WorkoutComment[];

  @OneToMany(() => RoutineSave, (routineSave) => routineSave.user)
  savedRoutines: Workout[];

  @OneToMany(() => UserFollower, (userFollower) => userFollower.follower)
  following: UserFollower[];

  @OneToMany(() => UserFollower, (userFollower) => userFollower.followed)
  followers: UserFollower[];

  @OneToMany(() => Group, (group) => group.owner)
  groups: Group[];

  @ManyToMany(() => Gym, (gym) => gym.users, { cascade: true })
  @JoinTable({
    name: 'user_gym',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'gymId',
      referencedColumnName: 'id',
    },
  })
  gyms: Gym[];

  @OneToMany(() => GroupPost, (post) => post.user)
  posts: GroupPost[];
}
