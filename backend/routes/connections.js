import express from 'express'
import Connection from '../models/Connection.js'
import Biodata from '../models/Biodata.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// @route   POST /api/connections
// @desc    Send a connection request
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { biodataId } = req.body

    const biodata = await Biodata.findById(biodataId)
    if (!biodata || biodata.status !== 'approved') {
      return res.status(404).json({ message: 'বায়োডাটা পাওয়া যায়নি' })
    }

    // Cannot request your own biodata
    if (biodata.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'নিজের বায়োডাটায় কানেকশন পাঠানো যাবে না।' })
    }

    const existing = await Connection.findOne({ requester: req.user._id, biodata: biodataId })
    if (existing) {
      return res.status(400).json({ message: 'ইতিমধ্যে অনুরোধ পাঠানো হয়েছে।' })
    }

    const connection = await Connection.create({
      requester: req.user._id,
      biodataOwner: biodata.user,
      biodata: biodataId,
    })

    res.status(201).json({ message: 'কানেকশন অনুরোধ পাঠানো হয়েছে।', connection })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// @route   GET /api/connections/my
// @desc    Get all connection requests for current user's biodata
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    // Requests received (on user's biodata)
    const received = await Connection.find({ biodataOwner: req.user._id })
      .populate('requester', 'phone')
      .populate('biodata', 'biodataNo type age occupation')
      .sort({ createdAt: -1 })

    // Requests sent by user
    const sent = await Connection.find({ requester: req.user._id })
      .populate('biodata', 'biodataNo type age occupation')
      .sort({ createdAt: -1 })

    res.json({ connections: received, sent })
  } catch (err) {
    res.status(500).json({ message: 'সমস্যা হয়েছে' })
  }
})

// @route   PUT /api/connections/:id/accept
// @desc    Accept a connection request
// @access  Private
router.put('/:id/accept', protect, async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id)
    if (!connection) return res.status(404).json({ message: 'কানেকশন পাওয়া যায়নি' })

    if (connection.biodataOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'অনুমতি নেই' })
    }

    connection.status = 'accepted'
    await connection.save()

    res.json({ message: 'কানেকশন গৃহীত হয়েছে।', connection })
  } catch (err) {
    res.status(500).json({ message: 'সমস্যা হয়েছে' })
  }
})

// @route   PUT /api/connections/:id/reject
// @desc    Reject a connection request
// @access  Private
router.put('/:id/reject', protect, async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id)
    if (!connection) return res.status(404).json({ message: 'কানেকশন পাওয়া যায়নি' })

    if (connection.biodataOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'অনুমতি নেই' })
    }

    connection.status = 'rejected'
    await connection.save()

    res.json({ message: 'কানেকশন প্রত্যাখ্যান করা হয়েছে।' })
  } catch (err) {
    res.status(500).json({ message: 'সমস্যা হয়েছে' })
  }
})

export default router
