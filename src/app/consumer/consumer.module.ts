import { Logger, Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schemas';
import { ConsumerController } from './consumer.controller';


@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),],
  controllers: [ConsumerController],
  providers: [ConsumerService, Logger],
})
export class ConsumerModule { }
