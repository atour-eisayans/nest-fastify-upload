import {
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UploadGuard } from './guards/upload.guard';
import { UploadInterceptor } from './interceptors/upload.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseGuards(UploadGuard)
  @UseInterceptors(UploadInterceptor)
  uploadHandler() {
    return 'File(s) have been uploaded';
  }
}
