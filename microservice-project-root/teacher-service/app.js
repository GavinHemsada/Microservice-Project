const express = require("express");
const cors = require("cors");
require("dotenv").config();
const teacherRouter = require("./src/router/teacher.router");
const { disconnectProducer } = require("./src/shared/event-bus/producer"); // Add this line

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/teacher", teacherRouter);

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
