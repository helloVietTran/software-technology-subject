import Joi from "joi";

export const updateCloseDaySchema = Joi.object({
  year: Joi.number().integer().required(),
  month: Joi.number().integer().min(1).max(12).required(),
  closeDay: Joi.number().integer().min(1).max(31).required()
}).custom((value, helpers) => {
  const { year, month, closeDay } = value;

  const maxDay = new Date(year, month, 0).getDate(); // last day of month

  if (closeDay > maxDay) {
    return helpers.error('any.invalid', {
      message: `closeDay cannot exceed ${maxDay} for ${month}/${year}`
    });
  }

  return value;
}, 'Close day validation');
