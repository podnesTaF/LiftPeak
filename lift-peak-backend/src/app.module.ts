import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import { DataSource } from 'typeorm';
import { config as typeOrmConfig } from './core/config/typeorm.config';
import { HttpRequestLogger } from './core/loggers/http-request.logger';
import { AuthModule } from './modules/auth/auth.module';
import { CommentModule } from './modules/comment/comment.module';
import { ExerciseModule } from './modules/exercise/exercise.module';
import { FeedModule } from './modules/feed/feed.module';
import { FileModule } from './modules/file/file.module';
import { GroupModule } from './modules/group/group.module';
import { LikeModule } from './modules/like/like.module';
import { MediaModule } from './modules/media/media.module';
import { OtpModule } from './modules/otp/otp.module';
import { RoleModule } from './modules/role/role.module';
import { TargetModule } from './modules/target/target.module';
import { UsersModule } from './modules/users/users.module';
import { WorkoutLogModule } from './modules/workout-log/workout-log.module';
import { WorkoutModule } from './modules/workout/workout.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, 'static'),
    }),
    UsersModule,
    RoleModule,
    FileModule,
    MediaModule,
    WorkoutModule,
    ExerciseModule,
    TargetModule,
    WorkoutLogModule,
    GroupModule,
    CommentModule,
    LikeModule,
    FeedModule,
    OtpModule,
  ],
  controllers: [],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer): void {
    if (process.env.NODE_ENV !== 'PRODUCTION') {
      consumer.apply(HttpRequestLogger).forRoutes('*');
    }
  }
}
