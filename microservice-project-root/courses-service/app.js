const express = require("express");
const cors = require("cors");
require("dotenv").config();
const coursesRouter = require("./src/router/courses.router");
const enrollmentRouter = require("./src/router/enrollment.router");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/courses", coursesRouter);
app.use("/api/enrollment", enrollmentRouter);

module.exports = app;
