import { Module } from '@nestjs/common';
import { ConsumerModule } from './app/consumer/consumer.module';
import { MongooseModule } from '@nestjs/mongoose';

const mongoUrl = 'mongodb://platform:C1Q7U1GQLYff4LsHBKfs@10.1.1.209:28017/sjoy-platform-ops-dev?authSource=admin'

@Module({
  imports: [
    MongooseModule.forRoot(mongoUrl),
    ConsumerModule,
  ],
})
export class AppModule { }
