import express from 'express'
import cors from 'cors'
import routes from './routes'
import dotenv from 'dotenv'
const { connectDB } = require('./db/index.js')

dotenv.config()

const app = express()

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'https://bookit-zxao.onrender.com/', // replace later with actual URL
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin))

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? allowedOrigins : '*',
    credentials: true,
  })
)

app.use(express.json())

// Connect to DB
connectDB()

// Routes
app.use('/', routes)

const PORT = Number(process.env.PORT) || 4000

// ✅ Always listen, including in production (Render needs this)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API server running on http://0.0.0.0:${PORT}`)
})

// ✅ Export for potential testing (optional)
export default app
