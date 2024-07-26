import { DownloadResponse, Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { StorageFile } from './types/file';

@Injectable()
export class FileService {
  private storage: Storage;
  private bucket: string;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY,
      },
    });

    this.bucket = process.env.STORAGE_MEDIA_BUCKET;
  }

  private setPrefix(prefix: string): string {
    let escDestination = '';
    escDestination += prefix.replace(/^\.+/g, '').replace(/^\/+|\/+$/g, '');
    if (escDestination !== '') escDestination = escDestination + '/';
    return escDestination;
  }

  async uploadFileToStorage(
    mediaName: string,
    prefix: string,
    contentType: string,
    media: Buffer,
    replaceUrl?: string,
  ): Promise<string> {
    await this.storage
      .bucket(this.bucket)
      .file(this.setPrefix(prefix) + mediaName)
      .delete({ ignoreNotFound: true });

    if (replaceUrl) await this.delete(replaceUrl);

    const metadata: {
      [key: string]: string;
      contentType: string;
    } = {
      mediaName,
      contentType: contentType,
    };

    return new Promise((resolve, reject) => {
      const path = this.setPrefix(prefix) + mediaName;
      const file = this.storage.bucket(this.bucket).file(path);
      const stream = file.createWriteStream({
        resumable: false,
        gzip: true,
        metadata: {
          metadata,
          contentType,
        },
      });

      stream.on('error', (error) => {
        console.error('Stream error:', error);
        reject(error);
      });

      stream.on('finish', async () => {
        try {
          await file.setMetadata({ metadata });
          resolve(file.publicUrl());
        } catch (error) {
          console.error('Error setting metadata:', error);
          reject(error);
        }
      });

      stream.end(media);
    });
  }

  async migrateToUrl(
    path: string | null,
    new_prefix: string,
  ): Promise<string> | null {
    if (!path) return null;

    const file = await this.getWithMetaData(path);

    const newPath = path.split('/').pop();

    const mediaUrl = await this.uploadFileToStorage(
      newPath,
      new_prefix,
      file.contentType || '',
      file.buffer,
    );

    if (mediaUrl) await this.delete(path);

    return mediaUrl || null;
  }

  async delete(path: string) {
    const decodedPath = decodeURIComponent(path);
    const filePath = decodedPath
      .split('https://storage.googleapis.com/' + this.bucket + '/')
      .pop();

    if (!filePath) {
      console.error('Invalid file path');
      return;
    }

    try {
      const file = this.storage.bucket(this.bucket).file(filePath);
      const [exists] = await file.exists();
      if (!exists) {
        console.error('File does not exist:', path);
        return;
      }
      await file.delete({ ignoreNotFound: false });
    } catch (error) {
      console.error('Error deleting file:', error.message);
    }
  }

  async get(path: string): Promise<StorageFile> {
    const fileResponse: DownloadResponse = await this.storage
      .bucket(this.bucket)
      .file(path)
      .download();
    const [buffer] = fileResponse;
    const storageFile = new StorageFile();
    storageFile.buffer = buffer;
    storageFile.metadata = new Map<string, string>();
    return storageFile;
  }

  async getWithMetaData(path: string): Promise<StorageFile> {
    const [bucketObj] = await this.storage
      .bucket(this.bucket)
      .file(path)
      .getMetadata();

    const { metadata } = bucketObj;
    const fileResponse: DownloadResponse = await this.storage
      .bucket(this.bucket)
      .file(path)
      .download();
    const [buffer] = fileResponse;

    const storageFile = new StorageFile();
    storageFile.buffer = buffer;
    storageFile.metadata = new Map<string, string>(
      Object.entries(metadata || {}) as any,
    );
    storageFile.contentType = storageFile.metadata.get('contentType');
    return storageFile;
  }
}
