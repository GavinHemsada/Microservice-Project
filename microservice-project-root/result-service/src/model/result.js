const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const ResultSchema = new Schema(
  {
    student_id: { type: Types.ObjectId, required: true },
    course_id: { type: Types.ObjectId, required: true },
    marks: { type: Number, required: true },
    grade: { type: String, required: true },
    semester: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Result = model("Result", ResultSchema);

module.exports = Result;
