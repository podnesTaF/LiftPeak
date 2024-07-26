import { IsString } from 'class-validator';
import { RoleEnum } from '../entities/role.entity';

export class CreateRoleDto {
  @IsString()
  name: RoleEnum;

  @IsString()
  description: string;
}
