import { Controller, Logger, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Ctx, KafkaContext, MessagePattern, Payload, } from '@nestjs/microservices'
import { kafkaConfig } from 'src/app/kafka/kafka.config';
import { ConsumerService } from './consumer.service';
import { OrderStatus } from '../constant';

@Controller()
export class ConsumerController implements OnModuleInit {
    constructor(private readonly consumerService: ConsumerService, private logger: Logger,) {
        this.logger = new Logger(ConsumerService.name)
    }
    @Client(kafkaConfig)
    client: ClientKafka;
    onModuleInit() {
        const requestPatterns = [
            'userInfo',
            "order"
        ];

        requestPatterns.forEach(pattern => {
            this.client.subscribeToResponseOf(pattern);
        });
    }

    @MessagePattern('order')
    async consumerOrder(@Payload() payload, @Ctx() context: KafkaContext) {
        const partition = context.getPartition();
        if (!payload) {
            return
        }
        const orderInfo = {
            uuid: payload.value.orderId,
            status: payload.value.status,
            partition: partition
        }
        const heartbeat = context.getHeartbeat();
        await heartbeat();
        switch (orderInfo.status) {
            case OrderStatus.Create:
                await this.consumerService.handleCreateOrder(orderInfo)
                break;
            case OrderStatus.Update:
                await this.consumerService.handleUpdateOrder(orderInfo)
                break;
            case OrderStatus.Finish:
                await this.consumerService.handleFinishOrder(orderInfo)
                break;
            default:
                break;
        }
        return 'success'
    }
}

