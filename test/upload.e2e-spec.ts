import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fstatic from '@fastify/static';
import * as fs from 'fs';
import { AppModule } from '../src/app.module';
import { join } from 'path';
import multipart from '@fastify/multipart';

describe('Upload', () => {
  let app: NestFastifyApplication;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.register(multipart, {
      limits: {
        files: 1,
        fileSize: 1000000,
        fields: 0,
      },
    });

    app.register(fstatic, {
      root: join(__dirname, '..', 'uploads'),
      prefix: '/upload/',
    });

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  describe('POST /upload', () => {
    it('should return 400 if request is not multipart', async () => {
      await request(app.getHttpServer()).post('/upload').expect(400);
    });

    it('should return 201 if everything go well', async () => {
      const sampleFilePath = join(__dirname, 'sample.jpg');
      const sampleFileStream = fs.createReadStream(sampleFilePath);

      const httpServer = app.getHttpServer();
      const { body } = await request(httpServer)
        .post('/upload')
        .set('Content-Type', 'multipart/form-data;')
        .attach('testUploads', sampleFileStream)
        .expect(201);

      expect(body).toHaveProperty('uploadedFiles');

      const uploadedFiles = body.uploadedFiles;
      expect(Array.isArray(uploadedFiles)).toBe(true);
      expect(uploadedFiles.length).toBe(1);
      await request(httpServer).get(`/upload/${uploadedFiles[0]}`).expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
