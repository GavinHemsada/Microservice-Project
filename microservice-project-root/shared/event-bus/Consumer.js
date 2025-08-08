const { Kafka } = require("kafkajs");
const kafka = new Kafka({
  clientId: "event-bus",
  brokers: ["kafka:9092"],
});

async function createConsumer(groupId, topic, handleMessage) {
  const consumer = kafka.consumer({ groupId });
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      await handleMessage(data);
    },
  });

  return {
    disconnect: async () => {
      await consumer.disconnect();
      console.log(`Consumer for group ${groupId} disconnected.`);
    },
  };
}

module.exports = { createConsumer };
