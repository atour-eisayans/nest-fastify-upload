import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';

@Injectable()
export class UploadGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest() as FastifyRequest;
    const contentTypeRegex = new RegExp('multipart/form-data');
    const isMultipart = contentTypeRegex.test(
      req.headers['content-type'] || '',
    );
    if (!isMultipart) {
      throw new BadRequestException('Request is not multipart');
    }

    return true;
  }
}
