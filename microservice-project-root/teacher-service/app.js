const express = require('express');
const cors = require('cors');
require('dotenv').config();
const teacherRouter = require('./src/router/teacher.router')

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/teacher', teacherRouter);

module.exports = app;