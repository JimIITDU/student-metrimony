const steps = [
  {
    step: '১',
    title: 'অ্যাকাউন্ট তৈরি করুন',
    desc: 'প্রথমে আপনার মোবাইল নম্বর দিয়ে অ্যাকাউন্ট তৈরি করুন। OTP যাচাই করে লগইন করুন।',
    icon: '👤',
  },
  {
    step: '২',
    title: 'বায়োডাটা পূরণ করুন',
    desc: 'আপনার ব্যক্তিগত তথ্য, শিক্ষাগত যোগ্যতা, পেশা, পরিবারের তথ্য এবং বিয়ে সম্পর্কিত তথ্য পূরণ করুন।',
    icon: '📋',
  },
  {
    step: '৩',
    title: 'অভিভাবকের অনুমতি নিন',
    desc: 'অবশ্যই আপনার অভিভাবকের (বাবা/মা/ভাই) অনুমতি নিয়ে বায়োডাটা জমা দিন। অভিভাবকের মোবাইল নম্বর সঠিকভাবে দিন।',
    icon: '👨‍👩‍👧',
  },
  {
    step: '৪',
    title: 'এপ্রুভালের জন্য অপেক্ষা করুন',
    desc: 'আমাদের টিম আপনার বায়োডাটা যাচাই করবে এবং সব তথ্য সঠিক থাকলে এপ্রুভ করবে।',
    icon: '✅',
  },
  {
    step: '৫',
    title: 'বায়োডাটা খুঁজুন',
    desc: 'বিভিন্ন ফিল্টার ব্যবহার করে আপনার পছন্দের পাত্র/পাত্রীর বায়োডাটা খুঁজুন।',
    icon: '🔍',
  },
  {
    step: '৬',
    title: 'যোগাযোগ করুন',
    desc: 'পছন্দের বায়োডাটা পেলে কানেকশন রিকোয়েস্ট পাঠান এবং অভিভাবকের সাথে যোগাযোগ করুন।',
    icon: '📞',
  },
]

export default function Guide() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-3 text-center" style={{ color: 'var(--green-dark)' }}>নির্দেশনা</h1>
      <p className="text-center text-gray-500 mb-10 text-sm">অর্ধেকদ্বীন ব্যবহার করার ধাপে ধাপে গাইড</p>

      <div className="space-y-4">
        {steps.map((s, i) => (
          <div key={i} className="flex gap-4 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div
              className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-lg"
              style={{ background: 'var(--green)' }}
            >
              {s.step}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{s.icon}</span>
                <h3 className="font-bold text-gray-800">{s.title}</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-10 p-6 rounded-2xl text-white text-center"
        style={{ background: 'var(--green)' }}
      >
        <p className="font-bold text-lg mb-2">ভিডিও গাইড দেখুন</p>
        <p className="text-green-100 text-sm mb-4">বিস্তারিত জানতে আমাদের YouTube চ্যানেলের ভিডিও দেখুন।</p>
        <a
          href="https://youtu.be/ZeYb22ZHy6M"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-lg font-semibold hover:bg-green-50 transition"
          style={{ color: 'var(--green-dark)' }}
        >
          ▶ YouTube-এ দেখুন
        </a>
      </div>
    </div>
  )
}
