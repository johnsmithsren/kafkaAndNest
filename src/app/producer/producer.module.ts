import { Logger, Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ProducerController } from './producer.controller';

@Module({
  providers: [ProducerService, Logger],
  controllers: [ProducerController],
})
export class ProducerModule { }
