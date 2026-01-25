import Joi from 'joi';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const attendanceLogSchema = Joi.object({
  employeeId: Joi.number().required(),
  employeeName: Joi.string().required(),
  email: Joi.string().email().required(),
  logDate: Joi.date().iso().required(),
  workStart: Joi.date().iso().required(),
  workEnd: Joi.string()
    .regex(timeRegex)
    .required()
    .messages({ 'string.pattern.base': 'workEnd must be in HH:mm format (e.g. 08:30)' }),
  checkedTime: Joi.string()
    .regex(timeRegex)
    .required()
    .messages({ 'string.pattern.base': 'checkedTime must be in HH:mm format (e.g. 17:45)' })
});
