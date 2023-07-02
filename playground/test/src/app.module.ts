import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  initLogModule,
  getEnvListByMode,
  LoggerMiddleware,
  HttpExceptionFilter,
  TransformInterceptor,
} from 'nestjs-business-component';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
console.log(getEnvListByMode());
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvListByMode(),
      isGlobal: true,
    }),
    initLogModule(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
