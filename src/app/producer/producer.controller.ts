import { Controller, Get } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { v4 } from 'uuid'

@Controller()
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {

  }


  @Get('/send')
  async send() {
    for (let j = 0; j < 10000; j++) {
      let orderId = v4();
      let msgArray = ['create', 'update', 'finish']
      for (let i = 0; i < 3; i++) {
        await this.producerService.send(
          'order',
          orderId,
          { orderId: orderId, status: msgArray[i] }
        );
      }
    }
    return "send message success"
  }

}
