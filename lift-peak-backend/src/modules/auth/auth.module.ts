import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMember } from '../group/entities/group-member.entity';
import { Group } from '../group/entities/group.entity';
import { GroupMemberService } from '../group/services/group-member.service';
import { Otp } from '../otp/entities/otp.entity';
import { OtpService } from '../otp/otp.service';
import { Role } from '../role/entities/role.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/services/users.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { GroupAdminGuard } from './guards/group-admin.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Global()
@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          global: true,
          secret: process.env.JWTSECRET,
          signOptions: { expiresIn: `${process.env.JWT_EXPIRATION_TIME}h` },
        };
      },
    }),
    TypeOrmModule.forFeature([User, Role, Group, GroupMember, Otp]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    GroupMemberService,
    OtpService,
    UsersService,
    GroupAdminGuard,
  ],
  exports: [
    AuthService,
    JwtModule,
    PassportModule,
    JwtAuthGuard,
    GroupAdminGuard,
  ],
})
export class AuthModule {}
