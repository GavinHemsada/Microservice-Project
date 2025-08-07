const app = require('./app');
const DB = require('./src/config/db');
const studentkafka = require('./src/Service/student-kafka')

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await DB(); 
    await studentkafka();
    app.listen(PORT, () => {
      console.log(`Server running on ${process.env.CLIENT_URL}:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

start();
