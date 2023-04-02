/**
 * The bootstrap function creates the NestJS application and sets up the necessary middleware and configuration.
 *
 * @export
 * @async
 * @function bootstrap
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Blogs')
    .setDescription('The blog post API for creating blogs')
    .setVersion('1.0')
    .addTag('blog')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Enable Cross-Origin Resource Sharing (CORS)
  app.enableCors();

  // Set up Helmet middleware for added security
  app.use(helmet());

  // Set up the Pino logger and global error interceptor
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  // Start the application
  await app.listen(3000);
}

bootstrap();
