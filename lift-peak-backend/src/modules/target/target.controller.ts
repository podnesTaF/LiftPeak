import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
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

  @Get('/body')
  async getBody() {
    return this.targetService.getBody();
  }

  @Post('/:id/path')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  async addTargetPath(
    @Body() body: { paths: { [key: string]: string[] } },
    @Param() id: number,
  ) {
    return this.targetService.addTargetPath(id, body.paths);
  }
}
