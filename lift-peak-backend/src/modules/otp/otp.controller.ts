import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedUser, GetUser } from '../users/decorators/user.decorator';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generateOtt(@GetUser() user: AuthenticatedUser) {
    const ott = await this.otpService.createToken({ user });
    return { ott };
  }

  @Post('/validate')
  async validate(@Body() { otp, email }: { otp: string; email: string }) {
    return this.otpService.validateToken(otp, email);
  }
}
