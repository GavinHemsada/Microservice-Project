const { Kafka } = require("kafkajs");
const kafka = new Kafka({
  clientId: "event-bus",
  brokers: ["kafka:9092"],
});

const producer = kafka.producer();

(async () => {
  await producer.connect();
})();

module.exports = { producer };
