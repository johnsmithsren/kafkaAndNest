import { Controller, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, MessagePattern, } from '@nestjs/microservices'
import { kafkaConfig } from 'src/kafkaConfig';
import { ConsumerService } from './consumer.service';

@Controller()
export class ConsumerController implements OnModuleInit {
    constructor(private readonly consumerService: ConsumerService) { }
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

    @MessagePattern('userInfo')
    async consumerUserInfo(payload: any) {
        console.log(JSON.stringify(payload) + ' userInfo');
        await this.consumerService.handleUserInfo(payload)
    }

    @MessagePattern('order')
    async consumerOrder(payload: any) {
        console.log(JSON.stringify(payload) + ' order');
        await this.consumerService.handleUserInfo(payload)
    }

}
