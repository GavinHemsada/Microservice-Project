const express = require("express");
const cors = require("cors");
require("dotenv").config();
const resultRouter = require("./src/router/result.router");
const { disconnectProducer } = require("../shared/event-bus/producer");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/result", resultRouter);

// Graceful shutdown for Kafka producer
process.on("SIGINT", async () => {
  await disconnectProducer();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await disconnectProducer();
  process.exit(0);
});

module.exports = app;
