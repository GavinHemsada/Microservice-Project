const Joi = require("joi");

const coursesDTO = Joi.object({
  teacher_id: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
});

module.exports = coursesDTO;
