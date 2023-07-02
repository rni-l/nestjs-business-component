# nestjs-business-component

## 目的

该仓库的封装主要是对平时开发会用到的组件进行封装，不会带有太多的业务逻辑，是通用型地封装。

## 功能

对常用的模块进行二次封装，方便使用、迭代和维护

1. 基于 winston 封装日志模块
3. 基于 swagger 封装文档模块
4. 提供环境变量处理模块
5. 提供日志中间件，收集请求日志
6. 提供请求响应拦截处理
7. 提供鉴权守卫
8. 提供异常处理
9. 提供脚手架生成功能



## 使用

```shell
npm i nestjs-business-component

```

### 修改基础配置

当前有以下默认配置：

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

提供了两个方法进行修改：
```typescript
import { setConstantByKey, setTransformByKey } from 'nestjs-business-component'

setConstantByKey('pageSize', 20)
setConstantByKey('setTransformByKey', (data) => ({ value: data }))
```



### 日志模块

引入：

app.module.ts

```typescript
import { initLogoModule } from 'nestjs-business-component'

@Module({
  imports: [
    initLogoModule()
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



使用：

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

### 文档模块

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



### 环境变量

基于 NestJs 的 `ConfigService` 进行封装，首先你的项目根目录要有相关的环境文件：

1. .env
2. .env.development
3. .env.production
4. ...

然后在不同环境的启动命令，添加相关的变量：
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

环境变量的合并策略：以 .env 为基础，根据启动命令的 MODE 获取相关的环境变量文件进行增量覆盖

比如有以下两个文件：

```shell
# .env
BASE=1
BASE2=2

# .env.development
# .env
BASE=2
BASE3=3
```

启动后，环境变量为：

```javascript
{
  BASE: 2,
  BASE2: 2,
  BASE3: 3
}
```

使用：

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



### 日志中间件

使用：

```typescript
import { LoggerMiddleware } from 'nestjs-business-component';
// ...
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
```

日志输出：

```shell
2023-06-25 16:37:38 [info] GET / {} body {} [0ms] - curl/7.79.1 ::ffff:127.0.0.1
2023-06-25 16:37:38 [info] GET / 200 12 [8ms] - curl/7.79.1 ::ffff:127.0.0.1
```



### 响应拦截处理

使用：

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

成功会返回这个数据格式：

```typescript
{
  code: '0000',
  success: true,
  data: ...
}
```

失败：

```typescript
{
  code: '500',
  success: false,
  msg: ''
}
```

返回的数据格式、code 的值都是可以修改，只需修改相关的配置即可。

这里还提供了两个装饰器：

1. `PageController` : 返回分页的格式化结构，而其中的 key 都是可以修改的：

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

   

2. `RawController`: 不会对值进行处理

### 鉴权守卫

TODO...

### 异常处理

使用：

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

