import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTSECRET,
    });
  }

  async validate(payload: { id: number; email: string; username: string }) {
    const data = {
      id: payload.id,
      email: payload.email,
    };

    const user = await this.userService.findOneByCondition(data);

    if (!user) {
      throw new UnauthorizedException("You don't have access to this page");
    }

    return {
      id: user.id,
      email: user.email,
    };
  }
}
