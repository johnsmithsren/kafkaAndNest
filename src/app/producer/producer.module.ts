import { Logger, Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ProducerController } from './producer.controller';
import { KafkaService } from '../kafka/kafka.service';

@Module({
  providers: [ProducerService, Logger, KafkaService],
  controllers: [ProducerController],
})
export class ProducerModule { }
