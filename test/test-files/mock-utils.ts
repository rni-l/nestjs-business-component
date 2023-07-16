import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
@Injectable()
export class MockUtils {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    readonly logger: Logger,
  ) {}

  async logInfo() {
    this.logger.info('abc');
  }
  async logWarn() {
    this.logger.warn('abc');
  }
  async logError() {
    this.logger.error('abc');
  }
}
