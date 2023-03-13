import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';
import fstatic from '@fastify/static';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.register(multipart, {
    limits: {
      files: 10,
      fileSize: 1000000,
      fields: 0,
    },
  });
  app.register(fstatic, {
    root: join(__dirname, '..', 'uploads'),
    prefix: '/upload/',
  });
  await app.listen(3000);
}
bootstrap();
