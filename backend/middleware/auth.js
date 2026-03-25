import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'লগইন করুন' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret')

    const user = await User.findById(decoded.id).select('-__v')
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'একাউন্ট পাওয়া যায়নি' })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'টোকেন অবৈধ বা মেয়াদোত্তীর্ণ' })
  }
}

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'শুধুমাত্র অ্যাডমিনের অনুমতি আছে' })
  }
  next()
}
