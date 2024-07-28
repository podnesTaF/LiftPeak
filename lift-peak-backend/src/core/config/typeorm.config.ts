import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config as evnconfig } from 'dotenv';
import { Role } from 'src/modules/role/entities/role.entity';
import { Profile } from 'src/modules/users/entities/profile.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Workout } from 'src/modules/workout/entities/workout.entity';

evnconfig();

export const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQLHOST || 'localhost',
  port: parseInt(process.env.MYSQLPORT, 10) || 3306,
  username: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  entities: [User, Role, Profile, Workout],
  synchronize: true,
};
