const Joi = require("joi");

const enrollmenttDTO = Joi.object({
  student_id: Joi.string().required(),
  course_id: Joi.string().required(),
  enrollment_date: Joi.string().required(),
});

module.exports = enrollmenttDTO;