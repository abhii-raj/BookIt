import express from 'express'
import cors from 'cors'
import routes from './routes'
const { connectDB } = require('./db/index.js')
const dotenv = require('dotenv')
dotenv.config()

const app = express()

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-frontend.vercel.app', // Replace with your actual frontend URL after deploying
  process.env.FRONTEND_URL
].filter((origin): origin is string => Boolean(origin))

app.use(cors({ 
  origin: process.env.NODE_ENV === 'production' ? allowedOrigins : '*',
  credentials: true
}))
app.use(express.json())

// Connect to DB
connectDB()

// Routes
app.use('/', routes)

const PORT = process.env.PORT || 4000

// Export for Vercel serverless
export default app

// Only listen in development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`)
  })
}
