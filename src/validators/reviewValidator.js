import Joi from 'joi'

export const reviewSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Judul tidak boleh kosong',
    'string.min': 'Judul minimal 3 karakter',
    'string.max': 'Judul maksimal 100 karakter',
    'any.required': 'Judul harus diisi'
  }),
  slug: Joi.string().required().messages({
    'string.empty': 'Slug tidak boleh kosong',
    'any.required': 'Slug harus diisi'
  }),
  status: Joi.boolean().required().messages({
    'any.required': 'Status harus diisi'
  }),
  coverImage: Joi.string().uri().required().messages({
    'string.empty': 'Gambar sampul tidak boleh kosong',
    'string.uri': 'Format URL gambar sampul tidak valid',
    'any.required': 'Gambar sampul harus diisi'
  }),
  description: Joi.string().min(10).max(150).required().messages({
    'string.empty': 'Deskripsi tidak boleh kosong',
    'string.min': 'Deskripsi minimal 10 karakter',
    'string.max': 'Deskripsi maksimal 150 karakter',
    'any.required': 'Deskripsi harus diisi'
  }),
  content: Joi.string().allow('').optional()
})
