import { KafkaOptions, Transport } from "@nestjs/microservices";
export const kafkaConfig: KafkaOptions = {
    transport: Transport.KAFKA,
    options: {
        client: {
            clientId: 'app-client',
            brokers: ['10.1.1.209:9192', '10.1.1.209:9292', "10.1.1.209:9392"],
            // ssl: true,
            // sasl: {
            //     mechanism: 'scram-sha-256',
            //     username: 'c3RpcnJlZC1zaGFyay0xMjE3OCR0DB_GFzlIpROvANUaUEk39UmbgVYE7y1-WRc',
            //     password:
            //         '88_ojJ3gnG24gZzspw865ebVpWvVbfSOIjXwStzaN4ejQmku6iha6HJafezawrSFOIACTw==',
            // },
        },
        consumer: {
            groupId: 'producer',
            allowAutoTopicCreation: true,
        },
        producer: {
            allowAutoTopicCreation: true
        }
    }
};
