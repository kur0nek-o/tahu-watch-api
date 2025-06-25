import express from 'express'
import authenticate from '../middlewares/authenticate.js'
import User from '../models/User.js'

const router = express.Router()

router.get('/me', authenticate, async (req, res) => {
  const userId = req.user.userId
  const user = await User.findById(userId).select('username')

  res.json({
    status: true,
    message: 'You are authenticated',
    data: {
      username: user.username
    }
  })
})

export default router
