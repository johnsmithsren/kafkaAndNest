import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDocument } from './schemas/order.schemas';
import { Model } from 'mongoose';
import { OrderStatus } from '../constant';
@Injectable()
export class ConsumerService {
  private readonly logger = new Logger(ConsumerService.name);
  constructor(@InjectModel('Order') public orderModel: Model<OrderDocument>,) {

  }

  async handleCreateOrder(info) {
    await this.orderModel.create(info);
  }

  async handleUpdateOrder(info) {
    // 判断订单
    let exist = await this.orderModel.find({ uuid: info.uuid, status: OrderStatus.Create }).countDocuments() == 1;
    // 如果没找到，应该就是顺序有错乱了
    if (!exist) {
      this.logger.error("order not found", info)
      return
    }
    // 更新订单状态
    await this.orderModel.updateOne({ uuid: info.uuid, status: OrderStatus.Create }, { $set: { status: OrderStatus.Update } });
  }

  async handleFinishOrder(info) {
    let exist = await this.orderModel.find({ uuid: info.uuid, status: OrderStatus.Update }).countDocuments() == 1;
    if (!exist) {
      this.logger.error("order not found", info)
      return
    }
    await this.orderModel.updateOne({ uuid: info.uuid, status: OrderStatus.Update }, { $set: { status: OrderStatus.Finish } });
  }

}
