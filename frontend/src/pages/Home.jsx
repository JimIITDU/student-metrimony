import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'

const countries = [
  'বাংলাদেশ','আয়ারল্যান্ড','অস্ট্রেলিয়া','ইন্দোনেশিয়া','ওমান','কাতার',
  'কানাডা','কুয়েত','জার্মানি','মালয়েশিয়া','যুক্তরাজ্য','যুক্তরাষ্ট্র',
  'সংযুক্ত আরব আমিরাত','সৌদি আরব','সিঙ্গাপুর','তুরস্ক','ভারত',
]

const howItWorks = [
  { icon: '📝', title: 'বায়োডাটা তৈরি করুন', desc: 'খুব সহজেই বিনামূল্যে অর্ধেকদ্বীনে বায়োডাটা তৈরি করতে পারবেন।' },
  { icon: '🔍', title: 'বায়োডাটা খুঁজুন', desc: 'বয়স, উপজেলা, পেশা, শিক্ষাগত যোগ্যতা সহ অনেক ফিল্টার ব্যবহার করে সহজেই বায়োডাটা খুঁজতে পারবেন।' },
  { icon: '📞', title: 'যোগাযোগ করুন', desc: 'আপনার বায়োডাটা কেউ পছন্দ করলে অথবা আপনি কারো বায়োডাটা পছন্দ করলে সরাসরি অভিভাবকের সাথে যোগাযোগ করতে পারবেন।' },
  { icon: '🕌', title: 'বিবাহ সম্পন্ন করুন', desc: 'বায়োডাটা ও কথাবার্তা পছন্দ হলে নিজ দায়িত্বে ভালভাবে খোঁজ নিয়ে সুন্নতি বিবাহ সম্পন্ন করুন।' },
]

export default function Home() {
  const [looking, setLooking] = useState('')
  const [marital, setMarital] = useState('')
  const [country, setCountry] = useState('')
  const [stats, setStats] = useState({ total: 0, grooms: 0, brides: 0, marriages: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/biodata/stats').then(res => setStats(res.data)).catch(() => {})
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (looking) params.set('type', looking)
    if (marital) params.set('maritalStatus', marital)
    navigate(`/search?${params.toString()}`)
  }

  const statCards = [
    { label: 'সর্বমোট পাত্র-পাত্রীর বায়োডাটা', value: stats.total, icon: '💑' },
    { label: 'সর্বমোট পাত্রের বায়োডাটা', value: stats.grooms, icon: '👤' },
    { label: 'সর্বমোট পাত্রীর বায়োডাটা', value: stats.brides, icon: '👤' },
    { label: 'সর্বমোট সফল বিবাহ', value: stats.marriages, icon: '💍' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 px-4 text-white text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--green-dark) 0%, var(--green) 60%, var(--green-light) 100%)' }}>
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-10 bg-white" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-10 bg-white" />

        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'Noto Serif Bengali, serif' }}>
            বৃহত্তম ইসলামিক ম্যাট্রিমনি
          </h1>
          <p className="text-lg md:text-xl text-green-100 mb-2">আপনার নিকটবর্তী এলাকাতে দ্বীনদার পাত্রপাত্রী খোঁজা এখন সহজ</p>
          <p className="text-sm text-green-200 italic mb-8 max-w-xl mx-auto">
            "যে ব্যক্তি বিয়ে করলো সে তার অর্ধেক দ্বীন পূর্ণ করে ফেললো।" — (বায়হাকী, শু'আবুল ঈমান –৫৪৮৬)
          </p>

          {/* Search Card */}
          <div className="bg-white text-gray-800 rounded-2xl shadow-2xl p-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">আমি খুঁজছি</label>
                <select value={looking} onChange={e => setLooking(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">সকল</option>
                  <option value="groom">পাত্রের বায়োডাটা</option>
                  <option value="bride">পাত্রীর বায়োডাটা</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">বৈবাহিক অবস্থা</label>
                <select value={marital} onChange={e => setMarital(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">সকল</option>
                  <option>অবিবাহিত</option><option>বিবাহিত</option>
                  <option>ডিভোর্সড</option><option>বিধবা</option><option>বিপত্নীক</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">স্থায়ী ঠিকানা</label>
                <select value={country} onChange={e => setCountry(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">ঠিকানা নির্বাচন করুন</option>
                  {countries.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button onClick={handleSearch}
              className="w-full py-3 rounded-xl text-white font-semibold text-base transition hover:opacity-90"
              style={{ background: 'var(--green)' }}>
              বায়োডাটা খুঁজুন
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
            <Link to="/create-biodata"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-green-800 font-semibold shadow hover:shadow-md transition">
              ＋ বায়োডাটা তৈরি করুন
            </Link>
            <a href="https://youtu.be/ZeYb22ZHy6M" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white text-white font-semibold hover:bg-white hover:text-green-800 transition">
              ▶ যেভাবে বায়োডাটা তৈরি করবেন
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'var(--green-dark)' }}>
            অর্ধেকদ্বীন সেবা গ্রহীতার পরিসংখ্যান
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statCards.map((s, i) => (
              <div key={i} className="text-center p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-3">{s.icon}</div>
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--green)' }}>
                  {s.value > 0 ? s.value.toLocaleString('bn-BD') : '---'}
                </div>
                <div className="text-xs text-gray-500 leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4" style={{ background: 'var(--cream)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'var(--green-dark)' }}>
            অর্ধেকদ্বীন যেভাবে কাজ করে
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-6 shadow-sm text-center hover:shadow-md transition">
                <div className="w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'var(--green)' }}>{i + 1}</div>
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--green-dark)' }}>{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 text-gray-300 text-xl">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 text-center text-white" style={{ background: 'var(--green)' }}>
        <h2 className="text-2xl font-bold mb-3">অর্ধেকদ্বীনে সম্পূর্ণ বিনামূল্যে বায়োডাটা তৈরি করা যায়</h2>
        <p className="text-green-100 mb-6 text-sm">এখনই আপনার বায়োডাটা তৈরি করুন এবং উপযুক্ত সঙ্গী খুঁজুন।</p>
        <Link to="/create-biodata"
          className="inline-block px-8 py-3 rounded-xl bg-white font-semibold hover:bg-green-50 transition"
          style={{ color: 'var(--green-dark)' }}>
          বায়োডাটা তৈরি করুন
        </Link>
      </section>
    </div>
  )
}
