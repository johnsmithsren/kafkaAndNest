import { KafkaOptions, Transport } from "@nestjs/microservices";
export const kafkaConfig: KafkaOptions = {
    transport: Transport.KAFKA,
    options: {
        client: {
            clientId: 'app-client',
            brokers: ['10.1.1.209:9192', '10.1.1.209:9292', "10.1.1.209:9392"],
        },
        consumer: {
            groupId: 'producer',
            allowAutoTopicCreation: true,
        },
    }
};
