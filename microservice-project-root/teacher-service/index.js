const app = require("./app");
const DB = require("./src/config/db");
const teacherKafka = require("./src/Service/teacher-kafka");

const PORT = process.env.PORT || 3001;

const start = async () => {
  try {
    await DB();
    await teacherKafka();
    app.listen(PORT, () => {
      console.log(`Server running on ${process.env.CLIENT_URL}:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};
start();
