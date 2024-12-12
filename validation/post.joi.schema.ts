import * as Joi from 'joi';

const postValidationSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'Title is required',
  }),
  content: Joi.string().required().messages({
    'string.empty': 'Content is required',
  }),
  tags: Joi.array().items(Joi.string()).messages({
    'array.base': 'Tags must be an array of strings',
  }),
  imageUrl: Joi.string().uri().optional().messages({
    'string.uri': 'Image URL must be a valid URI',
  }),
});

export default postValidationSchema;
