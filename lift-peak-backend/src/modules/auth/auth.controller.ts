import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUser, GetUser } from '../users/decorators/user.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: { user: any }) {
    return this.authService.login(req.user);
  }

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Get('authenticated')
  @UseGuards(JwtAuthGuard)
  async isLoggedIn(@GetUser() user: AuthenticatedUser) {
    return !!user;
  }

  @Post('request-reset')
  requestReset(@Body() dto: { email: string }) {
    return this.authService.resetPasswordRequest(dto.email);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: { jwt: string; password: string }) {
    return this.authService.resetPassword(dto.jwt, dto.password);
  }
}
