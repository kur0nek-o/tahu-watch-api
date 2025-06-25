import express from 'express'
import authenticate from '../middlewares/authenticate.js'

const router = express.Router()

router.get('/me', authenticate, async (req, res) => {
  res.json({
    status: true,
    message: 'You are authenticated'
  })
})

export default router
