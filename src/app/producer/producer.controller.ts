import { Controller, Get, Logger } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { v4 } from 'uuid'
import { KafkaService } from '../kafka/kafka.service';

@Controller()
export class ProducerController {
  constructor(private readonly producerService: ProducerService, private logger: Logger, private readonly kafkaService: KafkaService) {
    this.logger = new Logger(ProducerService.name)
  }


  @Get('/send')
  async send() {
    this.sendMessageAll()
    return "send message success"
  }

  // 注意封装promise，在表层处理中，不使用await，否则会阻塞这次请求，然后在内层中使用await保证顺序执行
  // 避免长时间阻塞
  private async sendMessageAll() {
    for (let j = 0; j < 10000; j++) {
      const orderId = v4();
      const msgArray = ['create', 'update', 'finish'];
      for (let i = 0; i < 3; i++) {
        await this.kafkaService.send(
          'order',
          orderId,
          { orderId: orderId, status: msgArray[i] }
        );
      }
    }
    this.logger.log('All messages have been sent');
  }

}
