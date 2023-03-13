import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadGuard } from './upload.guard';
import { UploadInterceptor } from './upload.interceptor';

describe('UploadController', () => {
  let controller: UploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
    })
      .overrideGuard(UploadGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .overrideInterceptor(UploadInterceptor)
      .useValue({
        intercept: jest.fn(),
      })
      .compile();

    controller = module.get<UploadController>(UploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return correct value', () => {
    const r = controller.uploadHandler();
    expect(r).toEqual({
      status: 'ok',
      error: null,
      message: expect.any(String),
    });
  });
});
