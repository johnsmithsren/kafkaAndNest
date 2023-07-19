import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDocument } from './schemas/user.message.schemas';
import { Model } from 'mongoose';
@Injectable()
export class ConsumerService {
  constructor(@InjectModel('UserMessage') public orderModel: Model<OrderDocument>) { }

  async handleUserInfo(info) {
    console.log('start insert')
    await this.orderModel.insertMany([{ ...info }]);
    console.log('finish insert')
  }

}
