import express from 'express'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

/**
 * @swagger
 * /api/protected/data:
 *   get:
 *     summary: Get protected data
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful access
 *       401:
 *         description: Unauthorized
 */
router.get('/data', verifyToken, (req, res) => {
  res.json({ message: 'This is protected data!', userId: req.user.id })
})

export default router
