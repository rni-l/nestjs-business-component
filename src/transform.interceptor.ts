import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  DECORATOR_PAGE_CONTROLLER,
  DECORATOR_RAW_CONTROLLER,
  baseConstants,
  baseTransform,
} from './constants';
import { Request } from 'express';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<Response<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;
    const isPaginate = this.reflector.get<boolean>(
      DECORATOR_PAGE_CONTROLLER,
      context.getHandler(),
    );
    const isRaw = this.reflector.get<boolean>(
      DECORATOR_RAW_CONTROLLER,
      context.getHandler(),
    );
    return next.handle().pipe(
      map((data) => {
        if (isRaw) return data;
        if (isPaginate) {
          let pageSize = 10;
          let pageNumber = 1;
          if (method.toLocaleUpperCase() === 'GET') {
            pageSize = Number(request.query[baseConstants.queryPageSizeKey]);
            pageNumber = Number(
              request.query[baseConstants.queryPageNumberKey],
            );
          } else {
            pageSize = Number(request.body[baseConstants.queryPageSizeKey]);
            pageNumber = Number(request.body[baseConstants.queryPageNumberKey]);
          }
          return baseTransform.transformSuccessData({
            [baseConstants.totalKey]: data.count,
            [baseConstants.pageNumberKey]:
              pageNumber ?? baseConstants.pageNumber,
            [baseConstants.pageSizeKey]: pageSize ?? baseConstants.pageSize,
            [baseConstants.dataKey]: data.rows,
          });
        }
        return baseTransform.transformSuccessData(data);
      }),
    );
  }
}
