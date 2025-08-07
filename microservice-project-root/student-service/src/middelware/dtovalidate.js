const validateDTO = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      errors: error.details.map(detail => ({
        message: detail.message,
        path: detail.path.join('.'),
      })),
    });
  }
  req.body = value;
  next();
};

module.exports = validateDTO;