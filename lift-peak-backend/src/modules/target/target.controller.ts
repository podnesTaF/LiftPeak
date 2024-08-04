import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/guards/roles.guard';
import { CreateTargetDto } from './dto/create-target.dto';
import { TargetService } from './target.service';

@Controller('targets')
export class TargetController {
  constructor(private readonly targetService: TargetService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  async create(@Body() dto: CreateTargetDto) {
    return this.targetService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll() {
    return this.targetService.getAll();
  }
}
