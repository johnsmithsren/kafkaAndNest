import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaType } from 'mongoose';

export type OrderDocument = Order & Document;
@Schema()
export class Order extends Document {
    @Prop({ index: true })
    uuid: string;

    @Prop({ index: true })
    status: string;

    @Prop()
    productId: string;

    @Prop({ default: Date.now })
    createdDate: Date;

    @Prop({ default: Date.now })
    updatedDate: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);