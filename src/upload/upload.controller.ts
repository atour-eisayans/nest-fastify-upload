import { Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { UploadGuard } from './upload.guard';
import { UploadInterceptor } from './upload.interceptor';

@Controller()
export class UploadController {
  @Post('upload')
  @UseGuards(UploadGuard)
  @UseInterceptors(UploadInterceptor)
  uploadHandler() {
    return {
      status: 'ok',
      error: null,
      message: 'files have been uploaded',
    };
  }
}
