import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-3 text-center" style={{ color: 'var(--green-dark)' }}>যোগাযোগ</h1>
      <p className="text-center text-gray-500 mb-10 text-sm">আমাদের সাথে যোগাযোগ করুন</p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <div className="text-3xl mb-2">📧</div>
          <div className="font-semibold text-gray-700 mb-1">ইমেইল</div>
          <a href="mailto:info@ordhekdeen.com" className="text-sm text-green-700 hover:underline">
            info@ordhekdeen.com
          </a>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <div className="text-3xl mb-2">💬</div>
          <div className="font-semibold text-gray-700 mb-1">Facebook Messenger</div>
          <a href="https://m.me/ordhekdeen" target="_blank" rel="noopener noreferrer" className="text-sm text-green-700 hover:underline">
            m.me/ordhekdeen
          </a>
        </div>
      </div>

      {sent ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="font-bold text-green-800 text-lg mb-1">বার্তা পাঠানো হয়েছে</h3>
          <p className="text-green-600 text-sm">আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">নাম</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="আপনার নাম লিখুন"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">ইমেইল</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="আপনার ইমেইল লিখুন"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">বার্তা</label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="আপনার বার্তা লিখুন..."
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-semibold transition hover:opacity-90"
            style={{ background: 'var(--green)' }}
          >
            বার্তা পাঠান
          </button>
        </form>
      )}
    </div>
  )
}
