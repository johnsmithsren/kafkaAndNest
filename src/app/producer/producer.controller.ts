import { Controller, Get } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { randomInt } from 'crypto';

@Controller()
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {

  }


  @Get('/send')
  async send() {
    for (let j = 0; j < 2; j++) {
      let orderId = randomInt(10000000000);
      let msgArray = ['create order', 'update order', 'finish order']
      for (let i = 0; i < 3; i++) {
        this.producerService.send(orderId, `${orderId}:${msgArray[i]}`);
      }
    }
    // this.appService.checkBroker()
    return "send message success"
  }

}
