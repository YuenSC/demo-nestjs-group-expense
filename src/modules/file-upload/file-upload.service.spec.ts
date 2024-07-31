import { PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { FileUploadService } from './file-upload.service';

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockImplementation((command) => {
      if (command instanceof PutObjectCommand) {
        return Promise.resolve();
      }
      throw new Error('Unrecognized command');
    }),
  })),
  PutObjectCommand: jest.fn(),
  GetObjectCommand: jest.fn(),
}));

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn().mockResolvedValue('http://presigned.url'),
}));

describe('FileUploadService', () => {
  let service: FileUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileUploadService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue({
              /* Mock S3 Config */
            }),
          },
        },
      ],
    }).compile();

    service = module.get<FileUploadService>(FileUploadService);
  });

  describe('uploadFile', () => {
    it('should successfully upload a file', async () => {
      const mockFile = {
        originalname: 'test.jpg',
        buffer: Buffer.from('test'),
        mimetype: 'image/jpeg',
      };
      const result = await service.uploadFile(mockFile as any);
      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('key');
      expect(result.url).toContain('http://presigned.url');
    });
  });

  describe('getPresignedSignedUrl', () => {
    it('should return a presigned URL', async () => {
      const key = 'some-key';
      const url = await service.getPresignedSignedUrl(key);
      expect(url).toEqual({ url: 'http://presigned.url' });
    });
  });
});
