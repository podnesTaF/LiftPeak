import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { EquipmentService } from './equipment.service';

@Controller('equipments')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'icon', maxCount: 1 },
    ]),
  )
  async createEquipment(
    @Body() dto: CreateEquipmentDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; icon?: Express.Multer.File[] },
  ) {
    return this.equipmentService.createEquipment(
      dto,
      files.image?.[0],
      files.icon?.[0],
    );
  }

  @Get()
  async getEquipments() {
    return this.equipmentService.getEquipments();
  }
}
