const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const EnrollmentsSchema = new Schema(
  {
    student_id: { type: Types.ObjectId, required: true },
    course_id: { type: Types.ObjectId, required: true },
    enrollment_date: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const Enrollments = model("Enrollments", EnrollmentsSchema);

module.exports = Enrollments;