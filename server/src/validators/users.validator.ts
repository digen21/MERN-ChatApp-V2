import Joi from "joi";

export const ValidateUserInput = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
  firstName: Joi.string().allow(null).optional(),
  lastName: Joi.string().allow(null).optional(),
  avatar: Joi.string().allow(null).optional(),
  color: Joi.number().allow(null).optional(),
  isProfileSetup: Joi.boolean().optional().default(false),
});

export const ValidateSignUpInput = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

export const ValidateSignInInput = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

export const updateUserProfile = Joi.object({
  firstName: Joi.string().required().messages({
    "string.empty": "First name is required",
  }),
  lastName: Joi.string().messages({
    "string.empty": "Last name is required",
  }),
  color: Joi.number().messages({
    "number.empty": "Color is required",
  }),
});
