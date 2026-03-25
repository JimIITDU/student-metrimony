export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message)

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({ message: `${field} ইতিমধ্যে বিদ্যমান।` })
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({ message: messages[0] })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'অবৈধ টোকেন' })
  }

  res.status(err.statusCode || 500).json({
    message: err.message || 'সার্ভারে সমস্যা হয়েছে',
  })
}
