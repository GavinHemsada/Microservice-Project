const { createConsumer } = require("../shared/event-bus/Consumer");
const { producer } = require("../shared/event-bus/producer");
const Teacher = require("../model/teacher");

async function teacheridValidate() {
  await createConsumer(
    "teacherid-check-group",
    "teacherid.check",
    async (data) => {
      try {
        const { correlationId, teacher_id } = data;
        console.log("[teacher Service] Got response:", data);
        const teacherDoc = await Teacher.findById(teacher_id);
        const isValid = !!teacherDoc;

        const result = await producer.send({
          topic: "teacherid.response",
          messages: [
            {
              value: JSON.stringify({ correlationId, isValid, teacher_id }),
            },
          ],
        });
        console.log("[teacher-service] send true or flase result",isValid, " id", correlationId, "result",result);
      } catch (err) {
        console.error("Error processing teacherid.check message:", err);
      }
    }
  );
}

module.exports = teacheridValidate;
