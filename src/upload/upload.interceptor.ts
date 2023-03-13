import { pipeline } from 'stream';
import * as fs from 'fs';
import { join as pathJoin } from 'path';
import { promisify } from 'util';
import { randomBytes } from 'crypto';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { FastifyRequest } from 'fastify';

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
    const savedFiles: string[] = [];
    const files = req.files();
    for await (const data of files) {
      const uploadDir = pathJoin(uploadFolder, data.fieldname);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      const fileName = `${randomBytes(4).toString('hex')}_${data.filename}`;
      await pump(
        data.file,
        fs.createWriteStream(pathJoin(uploadDir, fileName)),
      );
      savedFiles.push(`${data.fieldname}/${fileName}`);
    }
    return next
      .handle()
      .pipe(map((data) => ({ ...data, uploadedFiles: savedFiles })));
  }
}
