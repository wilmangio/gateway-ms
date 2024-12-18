import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './common/exceptions/rpc-exception.filter';

//npm i --save @nestjs/microservices


async function bootstrap() {
  const logger = new Logger('Main Gateway');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  //para que el class-validator y el class-transformer funcionen
  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true, // properties deben quedar como uno quiere que vengan
    })
   );

   //filto global del firlto de las excepciones
   app.useGlobalFilters( new RpcCustomExceptionFilter());


  await app.listen(envs.port);

  logger.log(`Gateway corriendo on port ${ envs.port } `);
}
bootstrap();
