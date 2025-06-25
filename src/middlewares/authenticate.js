import { verifyAccessToken } from '../utils/jwt.js'

const authenticate = (req, res, next) => {
  const token = req.cookies.accessToken

  if (!token) return res.sendStatus(401)

  try {
    const decoded = verifyAccessToken(token)
    req.user = decoded
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.sendStatus(401)
    } else {
      return res.sendStatus(403)
    }
  }
}

export default authenticate
