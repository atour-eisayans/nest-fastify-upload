import { pipeline } from 'stream';
import * as fs from 'fs';
import { join as pathJoin } from 'path';
import { promisify } from 'util';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FastifyRequest } from 'fastify';
import { MultipartFile } from '@fastify/multipart';

const pump = promisify(pipeline);

const uploadFolder = pathJoin(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

@Injectable()
export class UploadInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest() as FastifyRequest;
    const files: AsyncIterableIterator<MultipartFile> = req.files({
      limits: { fileSize: 10000000 },
    });
    for await (const data of files) {
      await pump(
        data.file,
        fs.createWriteStream(pathJoin(uploadFolder, data.filename)),
      );
    }
    return next.handle();
  }
}
