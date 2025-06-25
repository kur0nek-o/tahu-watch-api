import express from 'express'
import authenticate from '../middlewares/authenticate.js'
import Review from '../models/Review.js' // Make sure this exists

const router = express.Router()

router.get('/reviews', authenticate, async (req, res) => {
  try {
    const { title, status } = req.query
    const filter = {}

    if (title) {
      filter.title = { $regex: title, $options: 'i' }
    }
    if (status) {
      filter.status = status
    }

    const reviews = await Review.find(filter)
    res.json({
      status: true,
      message: 'Reviews fetched successfully',
      data: reviews
    })
  } catch (err) {
    res.status(500).json({ status: false, message: 'Server error' })
  }
})

export default router
