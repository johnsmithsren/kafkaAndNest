import { Logger, Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
@Module({
    providers: [KafkaService, Logger],
})
export class KafkaModule { }
