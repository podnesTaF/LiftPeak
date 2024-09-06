import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import sgMail from '@sendgrid/mail';
import * as bcrypt from 'bcrypt';
import { OtpService } from 'src/modules/otp/otp.service';
import { getOtpEmailTemplate } from 'src/modules/otp/templates/getOtpEmailTemplate';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {
    sgMail.setApiKey(process.env.SEND_GRID_API_K);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByCondition({ email });
    const isPasswordMatching = await bcrypt.compare(pass, user?.password);
    if (user && isPasswordMatching) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Partial<User>) {
    const payload = { username: user.username, email: user.email, id: user.id };
    const expiresAt =
      Date.now() + +process.env.JWT_EXPIRATION_TIME * 60 * 60 * 1000;

    return {
      ...payload,
      token: this.jwtService.sign(payload),
      expiresAt,
    };
  }

  async register(dto: CreateUserDto) {
    const userData = await this.usersService.create({
      ...dto,
    });

    return this.login(userData);
  }

  async resetPasswordRequest(email: string) {
    const user = await this.usersService.findOneByCondition({ email });

    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    const otp = await this.otpService.createToken({
      user,
      goal: 'reset-password',
    });

    const msg = {
      to: email,
      from: process.env.SEND_GRID_FROM_EMAIL,
      subject: 'Reset password | LiftPeak',
      html: getOtpEmailTemplate({
        otp: otp,
      }),
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.log('error sending email', error.message);
    }

    return otp;
  }

  async resetPassword(jwtToken: string, newPassword: string) {
    const tokenData = this.jwtService.decode(jwtToken) as {
      email: string;
      otp: string;
    };

    const user = await this.usersService.findOneByCondition({
      email: tokenData.email,
    });

    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    await this.otpService.removeByCondition({ jwtToken: jwtToken });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.usersService.update(user.id, { password: hashedPassword });

    return this.login(user);
  }
}
