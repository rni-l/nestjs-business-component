import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';

export function setupSwagger(
  app: INestApplication,
  options: {
    title?: string;
    description?: string;
    version?: string;
    docPath?: string;
    outputJsonFilePath?: string;
  } = {},
) {
  const builder = new DocumentBuilder()
    .setTitle(options.title ?? 'API')
    .setDescription(options.description ?? 'API Documentation')
    .setVersion(options.version ?? '1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, builder);
  SwaggerModule.setup(options.docPath ?? 'docs', app, document);
  if (options.outputJsonFilePath) {
    fs.writeFileSync(options.outputJsonFilePath, JSON.stringify(document));
  }
}
