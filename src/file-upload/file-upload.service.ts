import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUploadService {
  private client;
  private readonly bucketName = process.env.AWS_BUCKET_NAME;

  constructor(private readonly configService: ConfigService) {
    this.client = new S3Client(configService.getOrThrow('s3-config'));
  }

  async uploadFile(file: Express.Multer.File, prefix?: string) {
    try {
      const key = (prefix ?? '') + `${Date.now()}-${file.originalname}`;
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          originalName: encodeURI(file.originalname),
        },
      });

      await this.client.send(command);

      return {
        url: (await this.getPresignedSignedUrl(key)).url,
        key,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getPresignedSignedUrl(key?: string) {
    if (!key) return { url: null };

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.client, command, {
        expiresIn: 60 * 60 * 24, // 24 hours
      });

      return { url };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
