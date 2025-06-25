import Joi from 'joi'

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email tidak boleh kosong',
    'string.email': 'Format email tidak valid',
    'any.required': 'Email harus diisi'
  }),
  username: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'Username tidak boleh kosong',
    'string.min': 'Username minimal 3 karakter',
    'string.max': 'Username maksimal 30 karakter',
    'any.required': 'Username harus diisi'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password tidak boleh kosong',
    'string.min': 'Password minimal 6 karakter',
    'any.required': 'Password harus diisi'
  }),
  repeat_password: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Konfirmasi password tidak cocok',
    'any.required': 'Konfirmasi password harus diisi'
  })
})

export const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Username tidak boleh kosong',
    'any.required': 'Username harus diisi'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password tidak boleh kosong',
    'any.required': 'Password harus diisi'
  })
})
