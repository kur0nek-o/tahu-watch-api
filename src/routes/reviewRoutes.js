import express from 'express'
import authenticate from '../middlewares/authenticate.js'

import { create, deleteReview, edit, getAll, getBySlug } from '../controllers/reviewController.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { reviewSchema } from '../validators/reviewValidator.js'

const router = express.Router()

router.get('/reviews', authenticate, getAll)
router.get('/review', authenticate, getBySlug)
router.post('/review', authenticate, validateRequest(reviewSchema), create)
router.put('/review', authenticate, validateRequest(reviewSchema), edit)
router.delete('/review', authenticate, deleteReview)

export default router
