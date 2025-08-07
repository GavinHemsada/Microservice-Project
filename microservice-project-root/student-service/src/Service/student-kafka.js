const { createConsumer } = require("../shared/event-bus/Consumer");
const { producer } = require("../shared/event-bus/producer");
const Student = require("../model/student");

async function studentidValidate() {
  await createConsumer(
    "studentid-check-group",
    "studentid.check",
    async (data) => {
      try {
        const { correlationId, student_id } = data;
        const studentDoc = await Student.findById(student_id);
        const isValid = !!studentDoc;

        await producer.send({
          topic: "studentid.response",
          messages: [
            {
              value: JSON.stringify({ correlationId, isValid, student_id }),
            },
          ],
        });
      } catch (err) {
        console.error("Error processing studentid.check message:", err);
      }
    }
  );
}

module.exports = studentidValidate;
