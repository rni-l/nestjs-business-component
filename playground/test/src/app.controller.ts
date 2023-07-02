import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PageController } from 'nestjs-business-component';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private logger: Logger,
    private configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    this.logger.info(
      this.configService.get('BASE') + '_' + this.configService.get('PG_HOST'),
    );
    this.logger.warn('d');
    this.logger.error(new Error('sdfs'));
    return this.appService.getHello();
  }

  @Get('/error')
  getError(): string {
    throw new Error('sdf');
  }

  @Get('/page')
  @PageController()
  page() {
    return 'abc';
  }
}
