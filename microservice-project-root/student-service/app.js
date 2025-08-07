const express = require('express');
const cors = require('cors');
require('dotenv').config();
const studentRouter = require('./src/router/student.router');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/student', studentRouter);

module.exports = app;
