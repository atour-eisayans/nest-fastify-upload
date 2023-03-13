import { ExecutionContext, BadRequestException } from '@nestjs/common';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { UploadGuard } from './upload.guard';

const mockExecCtxGenerator = (contentType: string) =>
  createMock<ExecutionContext>({
    switchToHttp: () => ({
      getRequest: () => ({
        headers: {
          'content-type': contentType,
        },
      }),
    }),
  });

describe('Testing Upload Guard', () => {
  let uploadGuard: UploadGuard;
  let executionContext: DeepMocked<ExecutionContext>;

  beforeEach(() => {
    uploadGuard = new UploadGuard();
  });

  it('should throw error if content-type is not multipart', () => {
    try {
      executionContext = mockExecCtxGenerator('');
      uploadGuard.canActivate(executionContext);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should return true if content-type is correct', () => {
    try {
      executionContext = mockExecCtxGenerator('multipart/form-data');
      const isValid = uploadGuard.canActivate(executionContext);
      expect(isValid).toBe(true);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });
});
