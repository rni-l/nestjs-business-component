# nestjs-business-component

[中文文档](./README-ZH.md)

## Purpose

The purpose of this repository is to encapsulate commonly used components for development. It will not include excessive business logic and is intended to be a generic set of encapsulations.

## Features

The repository will provide secondary encapsulations of commonly used modules to facilitate ease of use, iteration, and maintenance.

Logging module encapsulated based on Winston.
Documentation module encapsulated based on Swagger.
Environment variable handling module provided.
Logging middleware offered to collect request logs.
Request and response interception handling.
Authentication guard provided.
Exception handling functionality.
Scaffold generation feature.

## Usage

```shell
# install
npm i nestjs-business-component -S
# other dependencies
npm i class-transformer class-validator @nestjs/swagger nest-winston @nestjs/config -S
```

### Modifying Basic Configuration

Currently, there are the following default configurations available:

```typescript
export const baseConstants: IBaseConstants = {
  reLoginCode: '401',
  commonErrorCode: '500',
  commonSuccessCode: '200',
  pageSize: 10,
  pageNumber: 1,
  pageSizeKey: 'pageSize',
  pageNumberKey: 'pageNumber',
  totalKey: 'total',
  dataKey: 'list',
  queryPageSizeKey: 'pageSize',
  queryPageNumberKey: 'pageNumber',
}
export const baseTransform = {
  transformSuccessData: (data) => ({
    code: baseConstants.commonSuccessCode,
    success: true,
    data,
  }),
  transformErrorData: (msg) => ({
    msg,
    code: baseConstants.commonErrorCode,
    success: false,
  }),
};
```

There are two methods provided for modification:

```typescript
import { setConstantByKey, setTransformByKey } from 'nestjs-business-component'

setConstantByKey('pageSize', 20)
setConstantByKey('setTransformByKey', (data) => ({ value: data }))
```

### Logging Module

app.module.ts

```typescript
import { initLogModule } from 'nestjs-business-component'

@Module({
  imports: [
    initLogModule()
  ]
})
export class AppModule{}
```

main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    // insert
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3110);
  } catch (error) {
  }
}
bootstrap();

```

Use:

```typescript
import { Controller, Get, Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Controller()
export class AppController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private logger: Logger,
  ) {}

  @Get()
  getHello(): string {
    this.logger.info('d');
    this.logger.warn('d');
    this.logger.error(new Error('sdfs'));
  }
}

```

### Document Module

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from 'nestjs-business-component';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  /** or
   setupSwagger(app, {
    title: 'sdfsfsdf',
    description: '....',
    version: '1.1.0',
    docPath: 'docs',
    outputJsonFilePath: './swagger.json', // generate swagger json file
  })
  */
  await app.listen(3000);
}
bootstrap();
```

### Environment Variable

Based on NestJs `ConfigService`, first of all, your project root directory must have related environment files:

1. .env
2. .env.development
3. .env.production
4. ...

Then start the command in different environments, add related variables:

```json
{
  "scripts": {
    "start:local": "cross-env MODE=local nest start --watch",
    "start:dev": "cross-env MODE=development node dist/main",
    "start:test": "cross-env MODE=test node dist/main",
    "start:prod": "cross-env MODE=production node dist/main",
  }
}
```

Environment variable merging strategy: Based on .env, get relevant environment variable files according to the MODE of the startup command for incremental coverage.

For example, there are the following two files：

```shell
# .env
BASE=1
BASE2=2

# .env.development
# .env
BASE=2
BASE3=3
```

After startup, the environment variable is：

```javascript
{
  BASE: 2,
  BASE2: 2,
  BASE3: 3
}
```

Use：

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { initLogModule, getEnvListByMode } from 'nestjs-business-component';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvListByMode(), // get env files
      isGlobal: true,
    }),
    initLogModule(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```



### Logging Middleware

Use：

```typescript
import { LoggerMiddleware } from 'nestjs-business-component';
// ...
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
```

Logging output：

```shell
2023-06-25 16:37:38 [info] GET / {} body {} [0ms] - curl/7.79.1 ::ffff:127.0.0.1
2023-06-25 16:37:38 [info] GET / 200 12 [8ms] - curl/7.79.1 ::ffff:127.0.0.1
```



### Response Interception

Use：

```typescript
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TransformInterceptor } from 'nestjs-business-component';

...
@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
```

Success：

```typescript
{
  code: '0000',
  success: true,
  data: ...
}
```

Fail：

```typescript
{
  code: '500',
  success: false,
  msg: ''
}
```

The format of returned data and the value of the "code" can be modified by changing the relevant configurations.

Additionally, two decorators are provided：

1. `PageController` : the repository provides a formatted structure for pagination, and the keys within it can be modified:

   ```typescript
   {
     code: '0000',
     success: true,
     data: {
       total,
       pageSize,
       pageNumber,
       list
     }
   }
   ```

2. `RawController`: the values will not be processed.

### Authentication Guard

TODO...

### Exception

use：

```typescript
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HttpExceptionFilter } from 'nestjs-business-component';

...
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}

```
### Complete example
```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from 'nestjs-business-component';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    setupSwagger(app);
    // insert
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3300);
  } catch (error) {}
}
bootstrap();

```

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  TransformInterceptor,
  initLogModule,
  getEnvListByMode,
  HttpExceptionFilter,
} from 'nestjs-business-component';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvListByMode(), // get env files
      isGlobal: true,
    }),
    initLogModule(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
```
