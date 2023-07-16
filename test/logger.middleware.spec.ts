import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
import { LoggerMiddleware } from '../src/logger.middleware';

describe('LoggerMiddleware', () => {
  let loggerMiddleware: LoggerMiddleware;
  let logger: Logger;
  let configService: ConfigService;

  beforeEach(() => {
    logger = {
      info: jest.fn(),
    } as unknown as Logger;
    configService = {
      get: jest.fn(),
    } as unknown as ConfigService;
    loggerMiddleware = new LoggerMiddleware(logger, configService);
  });

  describe('use', () => {
    it('should log the request and response', () => {
      process.env.MODE = 'production';
      const req = {
        ip: '127.0.0.1',
        method: 'GET',
        originalUrl: '/test',
        query: { id: '1' },
        body: { name: 'test' },
        get: jest.fn(),
      } as unknown as Request;
      const res = {
        statusCode: 200,
        get: (txt: string) => 123,
        on: jest.fn(),
      } as unknown as Response;
      const next = jest.fn();

      jest.spyOn(configService, 'get').mockReturnValueOnce('production');

      // @ts-ignore
      loggerMiddleware.use(req, res, next);

      expect(logger.info).toHaveBeenCalledTimes(1);
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('GET /test {"id":"1"} body {"name":"test"}'),
      );
      // @ts-ignore
      const closeCallback = res.on.mock.calls[0][1];
      closeCallback();

      expect(logger.info).toHaveBeenCalledTimes(2);
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('GET /test 200 123 ['),
      );
      process.env.MODE = 'test';
    });

    it('should not log the request and response in test mode', () => {
      const req = {} as unknown as Request;
      const res = {
        on: jest.fn(),
      } as unknown as Response;
      const next = jest.fn();

      jest.spyOn(configService, 'get').mockReturnValueOnce('test');

      // @ts-ignore
      loggerMiddleware.use(req, res, next);

      expect(logger.info).not.toHaveBeenCalled();
      // @ts-ignore
      expect(res.on).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
