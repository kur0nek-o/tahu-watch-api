import bcrypt from 'bcryptjs'
import express from 'express'
import RefreshToken from '../models/RefreshToken.js'
import User from '../models/User.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js'

const router = express.Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: 'Invalid credentials' })

  const accessToken = signAccessToken({ userId: user._id })
  const refreshToken = signRefreshToken({ userId: user._id })

  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  })

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 15 * 60 * 1000 // 15 minutes
  })

  res.status(200).json({ message: 'Login successful' })
})

router.post('/refresh-token', async (req, res) => {
  const token = req.body.refreshToken

  if (!token) return res.sendStatus(401)

  const stored = await RefreshToken.findOne({ token, revoked: false })

  if (!stored) return res.sendStatus(403)

  try {
    const payload = verifyRefreshToken(token)
    const newAccessToken = signAccessToken({ userId: payload.userId })

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 15 * 60 * 1000
    })

    res.status(200).json({ message: 'Access token refreshed' })
  } catch (err) {
    return res.sendStatus(403)
  }
})

router.post('/logout', async (req, res) => {
  const token = req.body.refreshToken
  if (token) {
    await RefreshToken.findOneAndDelete({ token })
  }
  res.clearCookie('accessToken')
  res.status(200).json({ message: 'Logged out' })
})

export default router
