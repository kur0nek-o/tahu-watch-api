import bcrypt from 'bcryptjs'
import RefreshToken from '../models/RefreshToken.js'
import User from '../models/User.js'

import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js'

export const register = async (req, res) => {
  try {
    const { email, username, password } = req.validatedBody

    const emailExists = await User.findOne({ email })
    const usernameExists = await User.findOne({ username })

    if (emailExists || usernameExists) {
      const errors = {}
      if (emailExists) {
        errors.email = 'Email sudah terdaftar'
      }
      if (usernameExists) {
        errors.username = 'Username sudah terdaftar'
      }

      return res.status(400).json({
        status: false,
        message: 'Email atau username sudah terdaftar',
        errors
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ email, username, password: hashedPassword })

    await user.save()

    res.status(200).json({
      status: true,
      message: 'Registrasi berhasil'
    })
  } catch (error) {
    console.error(error)

    res.status(200).json({
      status: false,
      message: error.message || 'Terjadi kesalahan saat registrasi'
    })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.validatedBody

  try {
    const user = await User.findOne({ email })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Email atau password salah')
    }

    const accessToken = signAccessToken({ userId: user._id })
    const refreshToken = signRefreshToken({ userId: user._id })

    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    })

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 15 * 60 * 1000 // 15 minutes
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    res.status(200).json({
      status: true,
      message: 'Login berhasil'
    })
  } catch (error) {
    console.error(error)

    res.status(200).json({
      status: false,
      message: error.message || 'Terjadi kesalahan saat login'
    })
  }
}

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) return res.sendStatus(401)

  try {
    const payload = verifyRefreshToken(refreshToken)

    const stored = await RefreshToken.findOne({ token: refreshToken, revoked: false })

    if (!stored) throw new Error('Invalid refresh token')

    if (stored.expires && stored.expires < new Date()) {
      throw new Error('Refresh token expired')
    }

    const newAccessToken = signAccessToken({ userId: payload.userId })

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 15 * 60 * 1000 // 15 minutes
    })

    res.status(200).json({
      status: true,
      message: 'Access token refreshed'
    })
  } catch (err) {
    console.error('Refresh error:', err.message)

    return res.sendStatus(403)
  }
}

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) return res.sendStatus(401)

  try {
    await RefreshToken.updateOne({ token: refreshToken }, { revoked: true })

    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(200).json({
      status: true,
      message: 'Logout berhasil'
    })
  } catch (error) {
    console.error(error)

    res.status(200).json({
      status: false,
      message: error.message || 'Terjadi kesalahan saat logout'
    })
  }
}
