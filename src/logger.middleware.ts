import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private logger: Logger,
    private configService: ConfigService,
  ) {}

  isDev = this.configService.get('MODE') === 'development';

  use(req: Request, res: Response, next: NextFunction) {
    if (process.env.MODE === 'test') {
      next();
      return;
    }
    const { ip, method, originalUrl, query, body } = req;
    const userAgent = req.get('user-agent') || '';
    const now = Date.now();
    this.logger.info(
      `${method} ${originalUrl} ${JSON.stringify(query)} body ${JSON.stringify(
        body,
      )} [${Date.now() - now}ms] - ${userAgent} ${ip}`,
    );

    res.on('close', () => {
      console.log('close');
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      this.logger.info(
        `${method} ${originalUrl} ${statusCode} ${contentLength} [${
          Date.now() - now
        }ms] - ${userAgent} ${ip}`,
      );
    });
    next();
  }
}
