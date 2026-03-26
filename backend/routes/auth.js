import express from 'express'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import User from '../models/User.js'
import OTP from '../models/OTP.js'

const router = express.Router()

// Rate limit OTP requests - max 5 per 15 min per IP
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  trustProxy: true,
  message: { message: 'অনেক বেশি OTP অনুরোধ করা হয়েছে। ১৫ মিনিট পরে চেষ্টা করুন।' },
})

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString()

// Send OTP to SMS (simulated in dev, plug in real SMS gateway for production)
const sendSMS = async (phone, otp) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`\n📱 [DEV] OTP for ${phone}: ${otp}\n`)
    return true
  }
  // TODO: Integrate Twilio or SSL Commerz SMS here
  // Example Twilio:
  // const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  // await client.messages.create({ body: `আপনার OrdhekDeen OTP: ${otp}`, from: process.env.TWILIO_PHONE_NUMBER, to: `+88${phone}` })
  return true
}

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  })
}

// @route   POST /api/auth/send-otp
// @desc    Send OTP to phone number
// @access  Public
router.post('/send-otp', otpLimiter, async (req, res) => {
  try {
    const { phone } = req.body

    if (!phone || phone.length < 11) {
      return res.status(400).json({ message: 'সঠিক মোবাইল নম্বর দিন' })
    }

    // Delete old OTPs for this phone
    await OTP.deleteMany({ phone })

    const otp = generateOTP()
    await OTP.create({ phone, otp })
    await sendSMS(phone, otp)

    const response = { message: 'OTP পাঠানো হয়েছে' }

    // In dev mode, return OTP in response so you can test without SMS
    if (process.env.NODE_ENV === 'development') {
      response.otp = otp
    }

    res.json(response)
  } catch (err) {
    res.status(500).json({ message: 'OTP পাঠাতে সমস্যা হয়েছে' })
  }
})

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and login (or register if new user)
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body

    if (!phone || !otp) {
      return res.status(400).json({ message: 'ফোন নম্বর ও OTP দিন' })
    }

    const otpRecord = await OTP.findOne({ phone, verified: false }).sort({ createdAt: -1 })

    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP পাওয়া যায়নি। নতুন OTP নিন।' })
    }

    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id })
      return res.status(400).json({ message: 'OTP মেয়াদোত্তীর্ণ। নতুন OTP নিন।' })
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'OTP ভুল হয়েছে' })
    }

    // Mark OTP as used
    await OTP.deleteOne({ _id: otpRecord._id })

    // Find or create user
    let user = await User.findOne({ phone })
    const isNewUser = !user

    if (!user) {
      user = await User.create({ phone })
    } else {
      user.lastLogin = new Date()
      await user.save()
    }

    const token = generateToken(user._id)

    res.json({
      message: isNewUser ? 'স্বাগতম! নিবন্ধন সম্পন্ন হয়েছে।' : 'লগইন সফল হয়েছে।',
      token,
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role,
        isNewUser,
      },
    })
  } catch (err) {
    res.status(500).json({ message: 'সার্ভারে সমস্যা হয়েছে' })
  }
})

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
import { protect } from '../middleware/auth.js'

router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user })
})

export default router
