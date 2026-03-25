import express from 'express'

const router = express.Router()

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'সব তথ্য পূরণ করুন।' })
    }

    // Log to console in dev mode
    console.log('\n📩 Contact Form Submission:')
    console.log(`Name: ${name}`)
    console.log(`Email: ${email}`)
    console.log(`Message: ${message}\n`)

    // TODO: Send email via nodemailer when in production
    // const transporter = nodemailer.createTransport({ ... })
    // await transporter.sendMail({ from: email, to: 'info@ordhekdeen.com', subject: `Contact: ${name}`, text: message })

    res.json({ message: 'আপনার বার্তা পাঠানো হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।' })
  } catch (err) {
    res.status(500).json({ message: 'সমস্যা হয়েছে' })
  }
})

export default router
