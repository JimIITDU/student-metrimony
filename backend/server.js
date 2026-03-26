import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.js'
import biodataRoutes from './routes/biodata.js'
import connectionRoutes from './routes/connections.js'
import contactRoutes from './routes/contact.js'
import adminRoutes from './routes/admin.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()

app.set('trust proxy', 1)

// Connect to MongoDB
connectDB()

// Middleware
app.use(helmet())
// NEW - copy this
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://student-metrimony.vercel.app',
  ],
  credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static file serving for uploads
app.use('/uploads', express.static('uploads'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'OrdhekDeen API is running 🕌', timestamp: new Date() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/biodata', biodataRoutes)
app.use('/api/connections', connectionRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/admin', adminRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Global error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`\n🕌 OrdhekDeen Backend running on port ${PORT}`)
  console.log(`📡 API: http://localhost:${PORT}/api`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`)
})
