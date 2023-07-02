import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ValidationError } from 'sequelize';
import { ValidationError as ClassValidationError } from 'class-validator';
import { baseConstants } from './constants';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private logger: Logger,
  ) {}
  catch(
    exception: HttpException | ValidationError | ClassValidationError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let errors: any;
    this.logger.error(exception.toString());
    if ((exception as ValidationError).errors) {
      errors = (exception as ValidationError).errors
        .map((error) => {
          return `${error.message}`;
        })
        .join('\n');
      // @ts-ignore
    } else if ((exception as ClassValidationError).response) {
      // @ts-ignore
      errors = exception.response.message;
    } else {
      // errors = (exception as HttpException).message;
      errors = (exception as HttpException).message || exception.toString();
    }
    // console.log(exception);
    // // @ts-ignore
    // console.log(exception.response.message);
    // // @ts-ignore
    // Object.entries(exception).forEach(([k, v]) => {
    //   console.log(k, v);
    // });
    // @ts-ignore
    let code = `${exception?.getStatus?.() ?? baseConstants.commonErrorCode}`;
    if (code === '401') code = baseConstants.reLoginCode;

    response.status(200).json({
      code: code,
      success: false,
      // TODO: 优化
      msg: Array.isArray(errors) ? errors.join('\n') : errors,
    });
  }
}
