import { Injectable } from '@nestjs/common';
import ffmpeg from 'fluent-ffmpeg';
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  unlink,
} from 'fs';
import { dirname, join } from 'path';
import sharp from 'sharp';
import { promisify } from 'util';

const unlinkAsync = promisify(unlink);

@Injectable()
export class MediaService {
  private ensureDirectoryExistence(filePath: string) {
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  async processFile(
    buffer: Buffer,
    outputFilename: string,
    mimetype: string,
  ): Promise<Buffer> {
    if (mimetype.startsWith('video/')) {
      return this.resizeVideo(buffer, outputFilename);
    } else if (mimetype.startsWith('image/')) {
      return this.resizeImage(buffer);
    } else {
      throw new Error('Unsupported file type');
    }
  }

  async resizeVideo(buffer: Buffer, outputFilename: string): Promise<Buffer> {
    // Generate a temporary file path for input
    const tempInputPath = join(
      __dirname,
      '..',
      '..',
      'temp',
      `${Date.now()}-input.mp4`,
    );
    const tempOutputPath = join(
      __dirname,
      '..',
      '..',
      'temp',
      `${Date.now()}-${outputFilename}`,
    );

    this.ensureDirectoryExistence(tempInputPath);

    // Write the video buffer to a temporary file
    await this.writeBufferToFile(buffer, tempInputPath);
    // Resize and compress the video
    await this.compressVideo(tempInputPath, tempOutputPath);

    // Read the resized video back into a buffer
    const resizedBuffer = await this.readFileToBuffer(tempOutputPath);

    // Clean up temporary files
    await unlinkAsync(tempInputPath);
    await unlinkAsync(tempOutputPath);

    return resizedBuffer;
  }

  private compressVideo(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          '-vf scale=-2:720', // Resize to 720p, maintaining aspect ratio
          '-c:v libx264', // Use H.264 codec
          '-preset slow', // Use slow preset for better compression
          '-crf 28', // Adjust quality (lower CRF means better quality but larger file)
          '-c:a aac', // Use AAC audio codec
          '-b:a 128k', // Set audio bitrate
          '-movflags +faststart', // Enables progressive download
        ])
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });
  }

  private async resizeImage(buffer: Buffer): Promise<Buffer> {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // Resize image to a maximum dimension while maintaining aspect ratio
    const maxWidth = 1080;
    const maxHeight = 1080;

    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      image.resize({
        width: maxWidth,
        height: maxHeight,
        fit: 'inside',
      });
    }

    // Compress the image to ensure it's under 1MB
    const compressedBuffer = await image
      .jpeg({ quality: 80 }) // Adjust quality to manage file size, 80 is usually a good balance
      .toBuffer();

    // Check the size of the compressed image
    if (compressedBuffer.length > 1 * 1024 * 1024) {
      throw new Error('Unable to resize the image below 1MB');
    }

    return compressedBuffer;
  }

  private writeBufferToFile(buffer: Buffer, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(filePath);
      writeStream.write(buffer);
      writeStream.end();
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
  }

  private readFileToBuffer(filePath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const stream = createReadStream(filePath);
      stream.on('data', (chunk) => chunks.push(chunk as Buffer));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', (err) => reject(err));
    });
  }
}
