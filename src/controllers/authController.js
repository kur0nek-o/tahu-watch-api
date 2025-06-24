import bcrypt from 'bcryptjs'

import RefreshToken from '../models/RefreshToken.js'
import User from '../models/User.js'

import { signAccessToken, signRefreshToken } from '../utils/jwt.js'

export const register = async (req, res) => {
  const { email, username, password } = req.body

  try {
    const existingUser = await User.findOne({ email, username })

    if (existingUser) throw new Error('Email atau username sudah terdaftar')

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
      message: 'Terjadi kesalahan saat registrasi, silakan coba lagi'
    })
  }
}

export const login = async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Username atau password salah')
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
      sameSite: 'Strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
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
      message: 'Username atau password salah'
    })
  }
}

// export const refreshToken = async (req, res) => {
//   const token = req.cookies.accessToken

//   if (!token) return res.sendStatus(401)

//     const decoded = verifyAccessToken(token)

//   const stored = await RefreshToken.findOne({ token, revoked: false })

//   if (!stored) return res.sendStatus(403)

//   try {
//     const payload = verifyRefreshToken(token)
//     const newAccessToken = signAccessToken({ userId: payload.userId })

//     res.cookie('accessToken', newAccessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'Strict',
//       maxAge: 15 * 60 * 1000
//     })

//     res.status(200).json({ message: 'Access token refreshed' })
//   } catch (err) {
//     return res.sendStatus(403)
//   }
// }
