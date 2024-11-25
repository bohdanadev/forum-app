import * as joi from 'joi';

const validationSchema = {
  signUp: joi
    .object({
      username: joi.string().trim().min(3).max(30).required(),
      email: joi.string().trim().email().lowercase().required(),
      password: joi.string().trim().min(8).required(),
      confirmPassword: joi.string().valid(joi.ref('password')).required(),
    })
    .options({ allowUnknown: false }),
  signIn: joi.object({
    identifier: joi.string().trim().min(3).max(30).required(),
    password: joi.string().trim().min(8).required(),
  }),
  update: joi.object({
    username: joi.string().trim().min(3).max(30),
    email: joi.string().trim().email().lowercase(),
  }),
};

export default validationSchema;
