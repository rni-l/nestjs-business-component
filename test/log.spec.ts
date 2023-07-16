import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER, WinstonModule } from 'nest-winston';
import { initLogModule } from '../src/log';
import { MockUtils } from './test-files/mock-utils';
import { MOCK_UTILS } from './test-files/constants';

describe('log module', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [initLogModule()],
      providers: [
        {
          useClass: MockUtils,
          provide: MOCK_UTILS,
        },
      ],
    }).compile();
  });

  it('should log an info message', () => {
    const logger = app.get(WINSTON_MODULE_PROVIDER);
    const mockUtils = app.get(MOCK_UTILS);
    const spy = jest.spyOn(logger, 'info').mockImplementation();
    mockUtils.logInfo();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('abc'));
    spy.mockRestore();
  });

  it('should log a warning message', () => {
    const logger = app.get(WINSTON_MODULE_PROVIDER);
    const mockUtils = app.get(MOCK_UTILS);
    const spy = jest.spyOn(logger, 'warn').mockImplementation();
    mockUtils.logWarn('abc');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('abc'));
    spy.mockRestore();
  });

  it('should log an error message', () => {
    const logger = app.get(WINSTON_MODULE_PROVIDER);
    const mockUtils = app.get(MOCK_UTILS);
    const spy = jest.spyOn(logger, 'error').mockImplementation();
    mockUtils.logError('abc');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('abc'));
    spy.mockRestore();
  });
});
