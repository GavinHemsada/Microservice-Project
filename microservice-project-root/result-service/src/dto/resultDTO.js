const Joi = require("joi");

const resultDTO = Joi.object({
  student_id: Joi.string().required(),
  course_id: Joi.string().required(),
  marks: Joi.number().required(),
  grade: Joi.string().required(),
  semester: Joi.string().required(),
});

module.exports = resultDTO;
