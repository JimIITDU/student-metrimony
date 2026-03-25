import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

const steps = ['ব্যক্তিগত তথ্য', 'শিক্ষা ও পেশা', 'পারিবারিক তথ্য', 'বিয়ে সম্পর্কিত']

const divisions = ['ঢাকা','চট্টগ্রাম','রাজশাহী','খুলনা','বরিশাল','সিলেট','রংপুর','ময়মনসিংহ']
const occupations = ['ইমাম','মাদ্রাসা শিক্ষক','শিক্ষক','ইঞ্জিনিয়ার','ব্যবসায়ী','সরকারী চাকুরী','বেসরকারী চাকুরী','ফ্রিল্যান্সার','ডাক্তার','শিক্ষার্থী','প্রবাসী','অন্যান্য']
const educationLevels = ['এসএসসি','এইচএসসি','স্নাতক','স্নাতকোত্তর','পিএইচডি','হাফেজ','মাওলানা','মুফতি','অন্যান্য']

export default function CreateBiodata() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const [form, setForm] = useState({
    type: 'groom',
    age: '',
    height: '',
    complexion: '',
    maritalStatus: 'অবিবাহিত',
    permanentAddress: { division: '', district: '', upazila: '' },
    currentAddress: { division: '', district: '', upazila: '' },
    education: '',
    educationMedium: 'general',
    occupation: '',
    monthlyIncome: '',
    islamicEducation: '',
    fiveTimesPrayer: true,
    beard: '',
    guardianName: '',
    guardianPhone: '',
    fatherOccupation: '',
    motherOccupation: '',
    siblings: '',
    aboutFamily: '',
    expectedSpouseQualities: '',
    willLiveWithParents: '',
    aboutSelf: '',
    agreedToTerms: false,
  })

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }))
  const setAddr = (type, field, val) => setForm(f => ({ ...f, [type]: { ...f[type], [field]: val } }))

  const handleSubmit = async () => {
    setLoading(true); setError('')
    try {
      await api.post('/biodata', form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'সমস্যা হয়েছে, আবার চেষ্টা করুন')
    } finally { setLoading(false) }
  }

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
  const labelCls = "block text-xs font-semibold text-gray-500 mb-1"

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--green-dark)' }}>বায়োডাটা তৈরি করুন</h1>

      {/* Step indicator */}
      <div className="flex gap-1 mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex-1">
            <div className={`h-1.5 rounded-full transition-all ${i <= step ? 'bg-green-600' : 'bg-gray-200'}`} />
            <div className={`text-xs mt-1 text-center hidden md:block ${i === step ? 'text-green-700 font-semibold' : 'text-gray-400'}`}>{s}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-gray-700 mb-5">{steps[step]}</h2>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">{error}</div>}

        {/* Step 0 - Personal */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>বায়োডাটার ধরন</label>
              <div className="flex gap-3">
                {[['groom','পাত্র'],['bride','পাত্রী']].map(([val,label]) => (
                  <button key={val} type="button"
                    onClick={() => set('type', val)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition ${form.type === val ? 'text-white border-transparent' : 'text-gray-600 border-gray-200'}`}
                    style={{ background: form.type === val ? 'var(--green)' : '' }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>বয়স</label>
                <input type="number" className={inputCls} placeholder="বছরে" value={form.age} onChange={e => set('age', e.target.value)} min={18} max={70} />
              </div>
              <div>
                <label className={labelCls}>উচ্চতা</label>
                <input type="text" className={inputCls} placeholder="যেমন: ৫ ফুট ৬ ইঞ্চি" value={form.height} onChange={e => set('height', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>গায়ের রং</label>
                <select className={inputCls} value={form.complexion} onChange={e => set('complexion', e.target.value)}>
                  <option value="">নির্বাচন করুন</option>
                  {['কালো','শ্যামলা','উজ্জ্বল শ্যামলা','ফর্সা','উজ্জ্বল ফর্সা'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>বৈবাহিক অবস্থা</label>
                <select className={inputCls} value={form.maritalStatus} onChange={e => set('maritalStatus', e.target.value)}>
                  {['অবিবাহিত','বিবাহিত','ডিভোর্সড','বিধবা','বিপত্নীক'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>স্থায়ী ঠিকানা - বিভাগ</label>
              <select className={inputCls} value={form.permanentAddress.division} onChange={e => setAddr('permanentAddress','division', e.target.value)}>
                <option value="">বিভাগ নির্বাচন করুন</option>
                {divisions.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>জেলা</label>
                <input className={inputCls} placeholder="জেলার নাম" value={form.permanentAddress.district} onChange={e => setAddr('permanentAddress','district', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>উপজেলা</label>
                <input className={inputCls} placeholder="উপজেলার নাম" value={form.permanentAddress.upazila} onChange={e => setAddr('permanentAddress','upazila', e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelCls}>নিজের সম্পর্কে কিছু লিখুন</label>
              <textarea rows={3} className={inputCls} placeholder="সংক্ষেপে নিজের সম্পর্কে লিখুন..." value={form.aboutSelf} onChange={e => set('aboutSelf', e.target.value)} />
            </div>
          </div>
        )}

        {/* Step 1 - Education & Job */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>সর্বোচ্চ শিক্ষাগত যোগ্যতা</label>
              <select className={inputCls} value={form.education} onChange={e => set('education', e.target.value)}>
                <option value="">নির্বাচন করুন</option>
                {educationLevels.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>পড়াশোনার মাধ্যম</label>
              <div className="flex gap-3">
                {[['general','জেনারেল'],['quomi','কওমি'],['aliya','আলিয়া']].map(([val,label]) => (
                  <button key={val} type="button"
                    onClick={() => set('educationMedium', val)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold border-2 transition ${form.educationMedium === val ? 'text-white border-transparent' : 'text-gray-600 border-gray-200'}`}
                    style={{ background: form.educationMedium === val ? 'var(--green)' : '' }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>দ্বীনি শিক্ষাগত যোগ্যতা (যদি থাকে)</label>
              <input className={inputCls} placeholder="যেমন: হাফেজ, মাওলানা ইত্যাদি" value={form.islamicEducation} onChange={e => set('islamicEducation', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>পেশা</label>
              <select className={inputCls} value={form.occupation} onChange={e => set('occupation', e.target.value)}>
                <option value="">নির্বাচন করুন</option>
                {occupations.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>মাসিক আয় (টাকায়)</label>
              <input type="number" className={inputCls} placeholder="মাসিক আয়" value={form.monthlyIncome} onChange={e => set('monthlyIncome', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>আপনি কি ৫ ওয়াক্ত নামাযী?</label>
              <div className="flex gap-3">
                {[[true,'হ্যাঁ'],[false,'না']].map(([val,label]) => (
                  <button key={label} type="button"
                    onClick={() => set('fiveTimesPrayer', val)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition ${form.fiveTimesPrayer === val ? 'text-white border-transparent' : 'text-gray-600 border-gray-200'}`}
                    style={{ background: form.fiveTimesPrayer === val ? 'var(--green)' : '' }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {form.type === 'groom' && (
              <div>
                <label className={labelCls}>দাড়ির বিস্তারিত</label>
                <input className={inputCls} placeholder="যেমন: সুন্নতী পদ্ধতিতে রাখি" value={form.beard} onChange={e => set('beard', e.target.value)} />
              </div>
            )}
          </div>
        )}

        {/* Step 2 - Family */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>অভিভাবকের নাম</label>
              <input className={inputCls} placeholder="বাবা বা মায়ের নাম" value={form.guardianName} onChange={e => set('guardianName', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>অভিভাবকের মোবাইল নম্বর</label>
              <input type="tel" className={inputCls} placeholder="01XXXXXXXXX" value={form.guardianPhone} onChange={e => set('guardianPhone', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>বাবার পেশা</label>
                <input className={inputCls} placeholder="পেশা" value={form.fatherOccupation} onChange={e => set('fatherOccupation', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>মায়ের পেশা</label>
                <input className={inputCls} placeholder="পেশা" value={form.motherOccupation} onChange={e => set('motherOccupation', e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelCls}>ভাই-বোনের সংখ্যা</label>
              <input className={inputCls} placeholder="যেমন: ২ ভাই, ১ বোন" value={form.siblings} onChange={e => set('siblings', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>পরিবার সম্পর্কে কিছু লিখুন</label>
              <textarea rows={3} className={inputCls} placeholder="পরিবারের পরিবেশ, দ্বীনদারিতা ইত্যাদি..." value={form.aboutFamily} onChange={e => set('aboutFamily', e.target.value)} />
            </div>
          </div>
        )}

        {/* Step 3 - Marriage expectations */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>পাত্র/পাত্রীর মধ্যে কী গুণ চান?</label>
              <textarea rows={4} className={inputCls} placeholder="আপনার প্রত্যাশিত সঙ্গীর গুণাবলী লিখুন..." value={form.expectedSpouseQualities} onChange={e => set('expectedSpouseQualities', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>বিয়ের পর শ্বশুরবাড়িতে থাকতে পারবেন কিনা?</label>
              <textarea rows={2} className={inputCls} placeholder="স্পষ্টভাবে হ্যাঁ/না এবং বিস্তারিত লিখুন" value={form.willLiveWithParents} onChange={e => set('willLiveWithParents', e.target.value)} />
            </div>
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-xs text-yellow-800 leading-relaxed">
              <strong>গুরুত্বপূর্ণ শর্তাবলী:</strong><br />
              ১. সকল তথ্য সত্য হতে হবে।<br />
              ২. অভিভাবকের অনুমতি নিতে হবে।<br />
              ৩. মিথ্যা তথ্য দিলে বায়োডাটা বাতিল করা হবে।
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.agreedToTerms} onChange={e => set('agreedToTerms', e.target.checked)} className="w-4 h-4 rounded accent-green-600" />
              <span className="text-sm text-gray-700">আমি সকল শর্তাবলীতে সম্মত এবং অভিভাবকের অনুমতি নিয়েছি।</span>
            </label>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="px-5 py-2 rounded-xl border text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition">
            ← আগে
          </button>

          {step < steps.length - 1 ? (
            <button type="button" onClick={() => setStep(s => s + 1)}
              className="px-5 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
              style={{ background: 'var(--green)' }}>
              পরবর্তী →
            </button>
          ) : (
            <button type="button" onClick={handleSubmit}
              disabled={!form.agreedToTerms || loading}
              className="px-5 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition"
              style={{ background: 'var(--green)' }}>
              {loading ? 'জমা হচ্ছে...' : '✅ জমা দিন'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
