import Joi from 'joi';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const attendanceLogSchema = Joi.object({
  employeeId: Joi.number().required(),
  employeeName: Joi.string().required(),
  email: Joi.string().email().required(),
  logDate: Joi.date().iso().required(),
  workStart: Joi.string()
    .regex(timeRegex)
    .required()
    .messages({ 'string.pattern.base': 'workStart must be in HH:mm format (e.g. 08:30)' }),
  workEnd: Joi.string()
    .regex(timeRegex)
    .required()
    .messages({ 'string.pattern.base': 'workEnd must be in HH:mm format (e.g. 08:30)' }),
  checkedTime: Joi.string()
    .regex(timeRegex)
    .required()
    .messages({ 'string.pattern.base': 'checkedTime must be in HH:mm format (e.g. 17:45)' })
});

export const attendanceFixRequestSchema = Joi.object({
  workDate: Joi.date()
    .iso()
    .required()
    .messages({
      'date.base': 'workDate must be a valid date',
      'date.format': 'workDate must be in ISO format (YYYY-MM-DD)',
      'any.required': 'workDate is required'
    }),

  reason: Joi.string()
    .max(255)
    .optional()
    .allow('')
    .messages({
      'string.max': 'reason must not exceed 255 characters'
    })
});
