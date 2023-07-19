import { Controller, Logger, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Ctx, KafkaContext, MessagePattern, Payload, } from '@nestjs/microservices'
import { kafkaConfig } from 'src/kafkaConfig';
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
        this.logger.log(JSON.stringify(payload) + ' order ' + partition);
        if (!payload) {
            return
        }
        const orderInfo = {
            uuid: payload.value.orderId,
            status: payload.value.status
        }
        switch (payload.status) {
            case OrderStatus.Create:
                this.consumerService.handleCreateOrder(orderInfo)
                break;
            case OrderStatus.Update:
                this.consumerService.handleUpdateOrder(orderInfo)
                break;
            case OrderStatus.Finish:
                this.consumerService.handleFinishOrder(orderInfo)
                break;
            default:
                break;
        }
        return 'success'
    }
}

