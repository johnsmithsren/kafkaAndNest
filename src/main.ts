import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { kafkaConfig } from './kafkaConfig';
async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, kafkaConfig);
  // const app = await NestFactory.create(AppModule)
  // app.connectMicroservice(microserviceConfig);
  // await app.startAllMicroservices();
  // await app.listen(3000)
  await app.listen();

}
bootstrap();
