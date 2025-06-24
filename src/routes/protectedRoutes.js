import express from 'express'
import authenticate from '../middlewares/authenticate.js'

const router = express.Router()

router.get('/me', authenticate, async (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user })
})

export default router
