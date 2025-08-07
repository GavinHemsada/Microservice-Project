const app = require("./app");
const DB = require("./src/config/db");
const Coueseskafka = require('./src/Service/course-kafka')

const PORT = process.env.PORT || 3003;

const start = async () => {
  try {
    await DB();
    await Coueseskafka();
    app.listen(PORT, () => {
      console.log(`Server running on ${process.env.CLIENT_URL}:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

start();
