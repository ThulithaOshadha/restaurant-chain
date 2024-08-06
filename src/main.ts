import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './config/config.type';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import validationOptions from './utils/validation-options';
import { ResponseInterceptor } from './utils/common/response.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});

  const configService = app.get(ConfigService<AllConfigType>);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
  //await app.listen(4000)
}
void bootstrap();
