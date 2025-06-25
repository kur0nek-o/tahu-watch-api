import express from 'express'

import { login, logout, refreshToken, register } from '../controllers/authController.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { loginSchema, registerSchema } from '../validators/authValidator.js'

const router = express.Router()

router.post('/register', validateRequest(registerSchema), register)
router.post('/login', validateRequest(loginSchema), login)
router.post('/refresh-token', refreshToken)
router.post('/logout', logout)

export default router
