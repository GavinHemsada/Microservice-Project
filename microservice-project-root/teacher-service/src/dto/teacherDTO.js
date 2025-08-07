const Joi = require('joi');

const teacherdto = Joi.object({ 
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  dob: Joi.string().required(),
  email: Joi.string().email().required(),
  gender: Joi.string().required(),
  phone: Joi.string().required(),
  password: Joi.string().required(),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
  subject: Joi.string().required()
});

module.exports = teacherdto;