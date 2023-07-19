import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ServerKafka, Client, ClientKafka } from '@nestjs/microservices';
import { Kafka, Producer, Admin, CompressionTypes } from 'kafkajs';
import { kafkaConfig } from 'src/kafkaConfig';

const TOPICNAME = 'order'
@Injectable()
export class ProducerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private admin: Admin
  constructor() {
    //@ts-ignore
    this.kafka = new Kafka({ ...kafkaConfig.options.client, ...kafkaConfig.options.consumer });
    this.producer = this.kafka.producer();
    this.admin = this.kafka.admin()

  }

  async onModuleInit(): Promise<void> {
    await this.connect();

  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  async connect() {
    await this.producer.connect();
    await this.admin.connect()
  }

  async disconnect() {
    await this.producer.disconnect();
    await this.admin.disconnect()
  }

  async send(orderId: number, msg: string) {
    const partition = await this.getPartition(orderId);
    const message = {
      value: msg,
      partition: partition,
    };
    const payload: any = {
      messageId: '' + new Date().valueOf(),
      body: message,
      messageType: 'Order',
      topicName: 'order',
    };
    const metadata = await this.producer
      .send({
        topic: TOPICNAME,
        messages: [{ value: JSON.stringify(payload), partition }],
        compression: CompressionTypes.GZIP
      })
      .catch(e => console.error(e.message, e));
    return message;
  }

  // 计算订单号的哈希，并根据分区数取模得到分区号
  async getPartition(orderId: number): Promise<number> {
    const hash = this.hashCode(orderId.toString());
    const partitionCount = await this.getPartitionNum(TOPICNAME)
    return Math.abs(hash % partitionCount);
  };

  // 计算字符串的哈希码
  hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // 32-bit bitwise operation
    }
    return hash;
  };

  async getPartitionNum(topicName: string) {
    const topicDescription = await this.admin.fetchTopicMetadata({
      topics: [topicName],
    });
    return topicDescription.topics[0].partitions.length;

  }
}
