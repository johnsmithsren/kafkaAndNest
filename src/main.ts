import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { kafkaConfig } from './app/kafka/kafka.config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
async function bootstrap() {
  // const app = await NestFactory.createMicroservice(AppModule, kafkaConfig);
  // await app.listen();
  const app = await NestFactory.create(AppModule,
    {
      logger: WinstonModule.createLogger({
        transports: [
          new winston.transports.DailyRotateFile({
            dirname: `logs`, // 日志保存的目录
            filename: '%DATE%.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: winston.format.combine(
              winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
              }),
              winston.format.json(),
            ),
          }),
        ],
      })
    })
  app.connectMicroservice(kafkaConfig);
  await app.startAllMicroservices();
  await app.listen(3000)
}
bootstrap();
