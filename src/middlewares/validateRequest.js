export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false })

    if (error) {
      const errorDetails = {}
      error.details.forEach((detail) => {
        const field = detail.path[0]
        if (!errorDetails[field]) {
          errorDetails[field] = detail.message
        }
      })

      return res.status(400).json({
        status: false,
        message: 'Validasi gagal',
        errors: errorDetails
      })
    }

    req.validatedBody = value
    next()
  }
}
