import express from 'express'
import RefreshToken from '../models/RefreshToken.js'

import { login, register } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)

// router.post('/refresh-token', )

router.post('/logout', async (req, res) => {
  const token = req.body.refreshToken

  if (token) {
    await RefreshToken.findOneAndDelete({ token })
  }

  res.clearCookie('accessToken')
  res.status(200).json({ message: 'Logged out' })
})

export default router
