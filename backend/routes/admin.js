import express from 'express'
import Biodata from '../models/Biodata.js'
import User from '../models/User.js'
import Connection from '../models/Connection.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

// All admin routes require login + admin role
router.use(protect, adminOnly)

// @route   GET /api/admin/stats
// @desc    Platform overview stats
// @access  Admin
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers, totalBiodatas, pendingBiodatas,
      approvedBiodatas, rejectedBiodatas, totalConnections, acceptedConnections,
    ] = await Promise.all([
      User.countDocuments(),
      Biodata.countDocuments(),
      Biodata.countDocuments({ status: 'pending' }),
      Biodata.countDocuments({ status: 'approved' }),
      Biodata.countDocuments({ status: 'rejected' }),
      Connection.countDocuments(),
      Connection.countDocuments({ status: 'accepted' }),
    ])

    res.json({
      totalUsers, totalBiodatas, pendingBiodatas,
      approvedBiodatas, rejectedBiodatas,
      totalConnections, acceptedConnections,
    })
  } catch (err) {
    res.status(500).json({ message: 'সমস্যা হয়েছে' })
  }
})

// @route   GET /api/admin/biodatas
// @desc    Get all biodatas (with optional status filter)
// @access  Admin
router.get('/biodatas', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const query = status ? { status } : {}
    const skip = (Number(page) - 1) * Number(limit)

    const [biodatas, total] = await Promise.all([
      Biodata.find(query)
        .populate('user', 'phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Biodata.countDocuments(query),
    ])

    res.json({ biodatas, total })
  } catch (err) {
    res.status(500).json({ message: 'সমস্যা হয়েছে' })
  }
})

// @route   PUT /api/admin/biodatas/:id/approve
// @desc    Approve a biodata
// @access  Admin
router.put('/biodatas/:id/approve', async (req, res) => {
  try {
    const biodata = await Biodata.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', rejectionReason: '' },
      { new: true }
    )
    if (!biodata) return res.status(404).json({ message: 'বায়োডাটা পাওয়া যায়নি' })
    res.json({ message: 'বায়োডাটা অনুমোদন করা হয়েছে।', biodata })
  } catch (err) {
    res.status(500).json({ message: 'সমস্যা হয়েছে' })
  }
})

// @route   PUT /api/admin/biodatas/:id/reject
// @desc    Reject a biodata with reason
// @access  Admin
router.put('/biodatas/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body
    const biodata = await Biodata.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectionReason: reason || 'শর্ত পূরণ হয়নি' },
      { new: true }
    )
    if (!biodata) return res.status(404).json({ message: 'বায়োডাটা পাওয়া যায়নি' })
    res.json({ message: 'বায়োডাটা প্রত্যাখ্যান করা হয়েছে।', biodata })
  } catch (err) {
    res.status(500).json({ message: 'সমস্যা হয়েছে' })
  }
})

// @route   DELETE /api/admin/biodatas/:id
// @desc    Delete a biodata
// @access  Admin
router.delete('/biodatas/:id', async (req, res) => {
  try {
    await Biodata.findByIdAndDelete(req.params.id)
    res.json({ message: 'বায়োডাটা মুছে ফেলা হয়েছে।' })
  } catch (err) {
    res.status(500).json({ message: 'সমস্যা হয়েছে' })
  }
})

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const skip = (Number(page) - 1) * Number(limit)
    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(),
    ])
    res.json({ users, total })
  } catch (err) {
    res.status(500).json({ message: 'সমস্যা হয়েছে' })
  }
})

// @route   PUT /api/admin/users/:id/make-admin
// @desc    Promote user to admin
// @access  Admin
router.put('/users/:id/make-admin', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: 'admin' }, { new: true })
    res.json({ message: 'অ্যাডমিন করা হয়েছে।', user })
  } catch (err) {
    res.status(500).json({ message: 'সমস্যা হয়েছে' })
  }
})

export default router
