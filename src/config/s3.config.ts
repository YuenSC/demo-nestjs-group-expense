import { S3ClientConfig } from '@aws-sdk/client-s3';
import { registerAs } from '@nestjs/config';

export default registerAs(
  's3-config',
  (): S3ClientConfig => ({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
  }),
);
