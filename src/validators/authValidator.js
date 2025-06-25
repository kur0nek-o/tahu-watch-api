import Joi from 'joi'

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email tidak boleh kosong',
    'string.email': 'Format email tidak valid',
    'any.required': 'Email harus diisi'
  }),
  username: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'Nama pengguna tidak boleh kosong',
    'string.min': 'Nama pengguna minimal 3 karakter',
    'string.max': 'Nama pengguna maksimal 30 karakter',
    'any.required': 'Nama pengguna harus diisi'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password tidak boleh kosong',
    'string.min': 'Password minimal 6 karakter',
    'any.required': 'Password harus diisi'
  }),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Konfirmasi password tidak cocok',
    'any.required': 'Konfirmasi password harus diisi'
  })
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email tidak boleh kosong',
    'string.email': 'Format email tidak valid',
    'any.required': 'Email harus diisi'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password tidak boleh kosong',
    'any.required': 'Password harus diisi'
  })
})
