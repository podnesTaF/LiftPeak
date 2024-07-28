import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import { config as typeOrmConfig } from './core/config/typeorm.config';
import { HttpRequestLogger } from './core/loggers/http-request.logger';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/file/file.module';
import { MediaModule } from './modules/media/media.module';
import { RoleModule } from './modules/role/role.module';
import { UsersModule } from './modules/users/users.module';
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    if (process.env.NODE_ENV !== 'PRODUCTION') {
      consumer.apply(HttpRequestLogger).forRoutes('*');
    }
  }
}
