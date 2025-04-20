import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})

process.on('SIGINT', () => {
  console.log('🔌 Closing server...')

  server.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})
