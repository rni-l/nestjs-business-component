import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger, setConstantByKey } from 'nestjs-business-component';

setConstantByKey('pageNumberKey', 'currentPage');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app, {
    title: 'sdfsfsdf',
    version: '1.1.0',
    docPath: 'docs2',
  });
  await app.listen(3000);
}
bootstrap();
