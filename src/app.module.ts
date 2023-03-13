import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
