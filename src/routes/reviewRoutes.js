import express from 'express'
import authenticate from '../middlewares/authenticate.js'

import { create, getAll } from '../controllers/reviewController.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { reviewSchema } from '../validators/reviewValidator.js'

const router = express.Router()

router.get('/reviews', authenticate, getAll)
router.post('/review', authenticate, validateRequest(reviewSchema), create)

export default router
