import express from 'express'
import authenticate from '../middlewares/authenticate.js'

import { create, getAll, getBySlug } from '../controllers/reviewController.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { reviewSchema } from '../validators/reviewValidator.js'

const router = express.Router()

router.get('/reviews', authenticate, getAll)
router.get('/review', authenticate, getBySlug)
router.post('/review', authenticate, validateRequest(reviewSchema), create)

export default router
