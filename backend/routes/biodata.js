import express from 'express'
import Biodata from '../models/Biodata.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/biodata
// @desc    Get all approved biodatas with filters & pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      type, maritalStatus, minAge, maxAge,
      occupation, division, page = 1, limit = 12,
      biodataNo,
    } = req.query

    const query = { status: 'approved' }

    if (type) query.type = type
    if (maritalStatus) query.maritalStatus = maritalStatus
    if (occupation) query.occupation = occupation
    if (division) query['permanentAddress.division'] = division
    if (biodataNo) query.biodataNo = Number(biodataNo)

    if (minAge || maxAge) {
      query.age = {}
      if (minAge) query.age.$gte = Number(minAge)
      if (maxAge) query.age.$lte = Number(maxAge)
    }

    const skip = (Number(page) - 1) * Number(limit)

    const [biodatas, total] = await Promise.all([
      Biodata.find(query)
        .select('-guardianPhone -guardianName -user')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Biodata.countDocuments(query),
    ])

    res.json({ biodatas, total, page: Number(page), pages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ message: 'সমস্যা হয়েছে' })
  }
})

// @route   GET /api/biodata/my
// @desc    Get current user's biodata
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const biodata = await Biodata.findOne({ user: req.user._id })
    res.json({ biodata })
  } catch (err) {
    res.status(500).json({ message: 'সমস্যা হয়েছে' })
  }
})

// @route   GET /api/biodata/stats
// @desc    Get platform statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const [total, grooms, brides] = await Promise.all([
      Biodata.countDocuments({ status: 'approved' }),
      Biodata.countDocuments({ status: 'approved', type: 'groom' }),
      Biodata.countDocuments({ status: 'approved', type: 'bride' }),
    ])
    res.json({ total, grooms, brides, marriages: Math.floor(total * 0.17) })
  } catch (err) {
    res.status(500).json({ message: 'সমস্যা হয়েছে' })
  }
})

// @route   GET /api/biodata/:id
// @desc    Get single biodata by ID
// @access  Public (contact details only for accepted connections)
router.get('/:id', async (req, res) => {
  try {
    const biodata = await Biodata.findById(req.params.id).select('-user -guardianPhone -guardianName')
    if (!biodata || biodata.status !== 'approved') {
      return res.status(404).json({ message: 'বায়োডাটা পাওয়া যায়নি' })
    }

    // Increment view count
    await Biodata.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } })

    res.json({ biodata })
  } catch (err) {
    res.status(500).json({ message: 'সমস্যা হয়েছে' })
  }
})

// @route   POST /api/biodata
// @desc    Create new biodata
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const existing = await Biodata.findOne({ user: req.user._id })
    if (existing) {
      return res.status(400).json({ message: 'আপনার ইতিমধ্যে একটি বায়োডাটা আছে।' })
    }

    const biodata = await Biodata.create({ ...req.body, user: req.user._id, status: 'pending' })
    res.status(201).json({ message: 'বায়োডাটা জমা দেওয়া হয়েছে। অনুমোদনের জন্য অপেক্ষা করুন।', biodata })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// @route   PUT /api/biodata/my
// @desc    Update current user's biodata
// @access  Private
router.put('/my', protect, async (req, res) => {
  try {
    const biodata = await Biodata.findOneAndUpdate(
      { user: req.user._id },
      { ...req.body, status: 'pending' }, // Re-submit for approval after edit
      { new: true, runValidators: true }
    )
    if (!biodata) return res.status(404).json({ message: 'বায়োডাটা পাওয়া যায়নি' })
    res.json({ message: 'বায়োডাটা আপডেট হয়েছে। পুনরায় অনুমোদনের জন্য অপেক্ষা করুন।', biodata })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// @route   DELETE /api/biodata/my
// @desc    Delete current user's biodata
// @access  Private
router.delete('/my', protect, async (req, res) => {
  try {
    await Biodata.findOneAndDelete({ user: req.user._id })
    res.json({ message: 'বায়োডাটা মুছে ফেলা হয়েছে।' })
  } catch (err) {
    res.status(500).json({ message: 'সমস্যা হয়েছে' })
  }
})

export default router
