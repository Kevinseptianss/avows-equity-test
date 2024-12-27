const Joi = require("joi");

const UserPayLoadSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = { UserPayLoadSchema };
