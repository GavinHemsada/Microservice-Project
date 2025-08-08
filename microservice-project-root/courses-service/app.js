const express = require("express");
const cors = require("cors");
require("dotenv").config();
const coursesRouter = require("./src/router/courses.router");
const enrollmentRouter = require("./src/router/enrollment.router");
const { disconnectProducer } = require("./src/shared/event-bus/producer"); // Add this line

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/courses", coursesRouter);
app.use("/api/enrollment", enrollmentRouter);

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
