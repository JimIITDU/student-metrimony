import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [tab, setTab] = useState('login')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [devOtp, setDevOtp] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const sendOtp = async () => {
    if (phone.length < 11) return setError('সঠিক মোবাইল নম্বর দিন')
    setError(''); setLoading(true)
    try {
      const res = await api.post('/auth/send-otp', { phone })
      setStep(2)
      if (res.data.otp) setDevOtp('[DEV MODE] OTP: ' + res.data.otp)
    } catch (err) {
      setError(err.response?.data?.message || 'OTP পাঠাতে সমস্যা হয়েছে')
    } finally { setLoading(false) }
  }

  const verifyOtp = async () => {
    if (otp.length < 4) return setError('OTP কোড দিন')
    setError(''); setLoading(true)
    try {
      const res = await api.post('/auth/verify-otp', { phone, otp })
      login(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'OTP ভুল হয়েছে')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 text-center text-white" style={{ background: 'var(--green)' }}>
            <div className="w-14 h-14 rounded-full bg-white mx-auto flex items-center justify-center mb-3">
              <span className="text-2xl font-bold" style={{ color: 'var(--green)' }}>OD</span>
            </div>
            <h2 className="font-bold text-lg">অর্ধেকদ্বীন</h2>
            <p className="text-green-100 text-xs mt-1">ইসলামিক ম্যাট্রিমনি</p>
          </div>
          <div className="flex border-b">
            {['login','register'].map(t => (
              <button key={t}
                className={`flex-1 py-3 text-sm font-semibold border-b-2 ${tab===t?'text-green-700':'text-gray-500 border-transparent'}`}
                style={{ borderColor: tab===t ? 'var(--green)' : 'transparent' }}
                onClick={() => { setTab(t); setStep(1); setError(''); setDevOtp('') }}>
                {t==='login'?'লগইন':'নিবন্ধন'}
              </button>
            ))}
          </div>
          <div className="p-6">
            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">{error}</div>}
            {devOtp && <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-xs font-mono">{devOtp}</div>}
            {step === 1 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">মোবাইল নম্বর</label>
                  <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="01XXXXXXXXX" />
                </div>
                <button onClick={sendOtp} disabled={loading}
                  className="w-full py-3 rounded-xl text-white font-semibold hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'var(--green)' }}>
                  {loading ? 'পাঠানো হচ্ছে...' : 'OTP পাঠান'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 text-center"><strong>{phone}</strong> নম্বরে OTP পাঠানো হয়েছে।</p>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">OTP কোড</label>
                  <input type="text" value={otp} onChange={e=>setOtp(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="------" maxLength={6} />
                </div>
                <button onClick={verifyOtp} disabled={loading}
                  className="w-full py-3 rounded-xl text-white font-semibold hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'var(--green)' }}>
                  {loading ? 'যাচাই হচ্ছে...' : 'যাচাই করুন'}
                </button>
                <button className="w-full text-sm text-gray-500 hover:text-green-700" onClick={() => { setStep(1); setError(''); setDevOtp('') }}>← পিছনে যান</button>
              </div>
            )}
            <div className="mt-4 text-center"><Link to="/" className="text-xs text-green-700 hover:underline">← হোমে ফিরুন</Link></div>
          </div>
        </div>
      </div>
    </div>
  )
}
