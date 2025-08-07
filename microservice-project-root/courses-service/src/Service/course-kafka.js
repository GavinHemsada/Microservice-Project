const { createConsumer } = require("../shared/event-bus/Consumer");
const { producer } = require("../shared/event-bus/producer");
const Coueses = require("../model/courses");

async function CouesesValidate() {
  await createConsumer(
    "courseid-check-group",
    "courseid.check",
    async (data) => {
      try {
        const { correlationId2, course_id } = data;
        const CouesesDoc = await Coueses.findById(course_id);
        const isValid = !!CouesesDoc;

        await producer.send({
          topic: "courseid.response",
          messages: [
            {
              value: JSON.stringify({ correlationId2, isValid, course_id }),
            },
          ],
        });
      } catch (err) {
        console.error("Error processing courseid.check message:", err);
      }
    }
  );
}

module.exports = CouesesValidate;
