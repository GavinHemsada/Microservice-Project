const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const CoursesSchema = new Schema(
  {
    teacher_id: { type: Types.ObjectId, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Courses = model("Courses", CoursesSchema);

module.exports = Courses;
