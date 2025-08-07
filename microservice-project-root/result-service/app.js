const express = require('express');
const cors = require('cors');
require('dotenv').config();
const resultRouter = require('./src/router/result.router');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/result', resultRouter);

module.exports = app;