import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, Admin, CompressionTypes } from 'kafkajs';
import { kafkaConfig } from 'src/app/kafka/kafka.config';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private producer: Producer;
    private admin: Admin
    private logger: Logger;
    constructor() {
        //@ts-ignore
        this.kafka = new Kafka({ ...kafkaConfig.options.client, ...kafkaConfig.options.consumer });
        this.producer = this.kafka.producer();
        this.admin = this.kafka.admin()
        this.logger = new Logger(KafkaService.name)

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

    async send(topic: string, uuid: number, msg) {
        const partition = await this.getPartition(topic, uuid);
        const message: any = {
            messageId: '' + new Date().valueOf(),
            value: msg,
            topicName: topic,
        };
        await this.producer
            .send({
                topic: topic,
                messages: [{ value: JSON.stringify(message), partition }],
                compression: CompressionTypes.GZIP
            })
            .catch(e => this.logger.error(e.message, e));
        return message;
    }

    // 计算订单号的哈希，并根据分区数取模得到分区号
    async getPartition(topic: string, uuid: number): Promise<number> {
        const hash = this.hashCode(uuid.toString());
        const partitionCount = await this.getPartitionNum(topic)
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
        if (topicDescription.topics.length == 0) {
            throw "topic not found"
        }
        return topicDescription.topics[0].partitions.length;
    }
}
