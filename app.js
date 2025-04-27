import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import authRoutes from './src/routes/authRoutes.js'
import protectedRoutes from './src/routes/protectedRoutes.js'
import { swaggerSpec, swaggerUi } from './swagger.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/protected', protectedRoutes)

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected')

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })
  })
  .catch((err) => console.error(err))
