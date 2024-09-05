import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthenticatedUser } from '../users/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { Otp } from './entities/otp.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    private readonly jwtService: JwtService,
  ) {}

  async createToken({
    user,
    expiresInMinutes = 5,
    goal,
  }: {
    user: User | AuthenticatedUser;
    jwtToken?: string;
    expiresInMinutes?: number;
    goal?: string;
  }): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const jwtToken = this.jwtService.sign({ otp, email: user.email });

    const expiresAt = new Date(Date.now() + expiresInMinutes * 60000);

    const tokenEntity = this.otpRepository.create({
      otp,
      email: user.email,
      expiresAt,
      jwtToken,
      purpose: goal,
    });

    await this.otpRepository.save(tokenEntity);

    return otp;
  }

  async validateToken(otp: string, email: string) {
    const token = await this.otpRepository.findOne({
      where: { otp, email },
    });

    if (!token) {
      return false;
    }

    if (token.expiresAt < new Date()) {
      throw new BadRequestException('Token has expired');
    }

    return token.jwtToken;
  }

  removeByCondition(conditions: { [key: string]: any }) {
    return this.otpRepository.delete(conditions);
  }
}
