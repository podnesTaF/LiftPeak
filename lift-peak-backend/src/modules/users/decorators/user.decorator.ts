import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from 'src/modules/role/entities/role.entity';

export interface AuthenticatedUser {
  id: number;
  username: string;
  email: string;
  role: Role;
}

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
