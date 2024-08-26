import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  ServiceUnavailableException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { FileService } from '../file/file.service';
import { StorageFile } from '../file/types/file';

@Controller('media')
export class MediaController {
  constructor(private storageService: FileService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        files: 1,
      },
    }),
  )
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body() { prefix }: { prefix: string },
  ) {
    const url = await this.storageService.uploadFileToStorage(
      file.originalname,
      prefix,
      file.mimetype,
      file.buffer,
    );

    return { mediaUrl: url };
  }

  @Get('/*')
  async downloadMedia(@Param('0') path: string, @Res() res: Response) {
    let storageFile: StorageFile;
    try {
      storageFile = await this.storageService.getWithMetaData(path);
    } catch (e) {
      if (e.message.toString().includes('No such object')) {
        throw new NotFoundException('image not found');
      } else {
        throw new ServiceUnavailableException('internal error');
      }
    }

    res.setHeader('Content-Type', storageFile.contentType);
    res.setHeader('Cache-Control', 'max-age=60d');
    res.end(storageFile.buffer);
  }

  @Delete()
  async deleteMedia(@Query('url') url: string) {
    await this.storageService.delete(url);
  }
}
