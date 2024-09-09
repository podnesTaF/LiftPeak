import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileService } from '../file/file.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { Equipment } from './entities/equipment.entity';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>,
    private readonly fileService: FileService,
  ) {}

  async createEquipment(
    dto: CreateEquipmentDto,
    image?: Express.Multer.File,
    icon?: Express.Multer.File,
  ) {
    let imageUrl: string = null;
    let iconUrl: string = null;
    if (image) {
      imageUrl = await this.fileService.uploadFileToStorage(
        image.originalname,
        `/equipment/${dto.name}`,
        image.mimetype,
        image.buffer,
      );
    }
    if (icon) {
      iconUrl = await this.fileService.uploadFileToStorage(
        icon.originalname,
        `/equipment/${dto.name}`,
        icon.mimetype,
        icon.buffer,
      );
    }

    const equipment = this.equipmentRepository.create({
      ...dto,
      imageUrl,
      iconUrl,
    });

    await this.equipmentRepository.save(equipment);

    return equipment;
  }

  async getEquipments() {
    return await this.equipmentRepository.find();
  }
}
