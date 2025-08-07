const app = require('./app');
const DB = require('./src/config/db');

const PORT = process.env.PORT || 3002;

const start = async () => {
  try {
    await DB(); 
    app.listen(PORT, () => {
      console.log(`Server running on ${process.env.CLIENT_URL}:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

start();