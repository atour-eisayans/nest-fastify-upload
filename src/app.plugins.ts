import { NestFastifyApplication } from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';
import fstatic from '@fastify/static';
import { join } from 'path';

export default function (app: NestFastifyApplication) {
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
}
