import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { kafkaConfig } from './app/kafka/kafka.config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as colors from 'colors';
import 'winston-daily-rotate-file';
async function bootstrap() {
  // const app = await NestFactory.createMicroservice(AppModule, kafkaConfig);
  // await app.listen();
  const app = await NestFactory.create(AppModule,
    {
      logger: WinstonModule.createLogger({
        transports: [
          // 输出到控制台
          new winston.transports.Console({
            level: 'debug', // 控制台输出的日志级别
            format: winston.format.combine(
              winston.format.colorize({ all: true }),
              winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
              }),
              winston.format.printf(({ level, message, timestamp, context }) => {
                return `${timestamp} [${level}][${context}]: ${message}`
              })
            ),
          }),
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
              winston.format.printf(({ level, message, timestamp, context }) => {
                return `${timestamp} [${level}][${context}]: ${message}`
              })
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
