import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function BiodataDetail() {
  const { id } = useParams()
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [biodata, setBiodata] = useState(null)
  const [loading, setLoading] = useState(true)
  const [requested, setRequested] = useState(false)
  const [reqLoading, setReqLoading] = useState(false)

  useEffect(() => {
    api.get(`/biodata/${id}`)
      .then(res => setBiodata(res.data.biodata))
      .catch(() => navigate('/search'))
      .finally(() => setLoading(false))
  }, [id])

  const sendConnectionRequest = async () => {
    if (!isLoggedIn) return navigate('/login')
    setReqLoading(true)
    try {
      await api.post('/connections', { biodataId: id })
      setRequested(true)
    } catch (err) {
      alert(err.response?.data?.message || 'সমস্যা হয়েছে')
    } finally { setReqLoading(false) }
  }

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-400">লোড হচ্ছে...</div>
  if (!biodata) return null

  const Section = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="font-bold text-sm mb-3 pb-1 border-b" style={{ color: 'var(--green-dark)' }}>{title}</h3>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  )

  const Field = ({ label, value }) => (
    <div>
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-sm font-medium text-gray-800">{value || 'উল্লেখ নেই'}</div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header card */}
      <div className="text-white rounded-2xl p-6 mb-6 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, var(--green-dark), var(--green))' }}>
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl font-bold" style={{ color: 'var(--green)' }}>
          {biodata.type === 'groom' ? '♂' : '♀'}
        </div>
        <div>
          <div className="text-lg font-bold">বায়োডাটা #{biodata.biodataNo}</div>
          <div className="text-green-100 text-sm">{biodata.type === 'groom' ? 'পাত্রের বায়োডাটা' : 'পাত্রীর বায়োডাটা'}</div>
          <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${biodata.status === 'approved' ? 'bg-green-200 text-green-900' : 'bg-yellow-200 text-yellow-900'}`}>
            {biodata.status === 'approved' ? '✅ অনুমোদিত' : '⏳ অপেক্ষমাণ'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <Section title="ব্যক্তিগত তথ্য">
          <Field label="বয়স" value={`${biodata.age} বছর`} />
          <Field label="উচ্চতা" value={biodata.height} />
          <Field label="গায়ের রং" value={biodata.complexion} />
          <Field label="বৈবাহিক অবস্থা" value={biodata.maritalStatus} />
          <Field label="স্থায়ী ঠিকানা" value={`${biodata.permanentAddress?.upazila || ''}, ${biodata.permanentAddress?.district || ''}, ${biodata.permanentAddress?.division || ''}`} />
        </Section>

        <Section title="শিক্ষা ও পেশা">
          <Field label="সর্বোচ্চ শিক্ষা" value={biodata.education} />
          <Field label="মাধ্যম" value={biodata.educationMedium} />
          <Field label="দ্বীনি শিক্ষা" value={biodata.islamicEducation} />
          <Field label="পেশা" value={biodata.occupation} />
          <Field label="মাসিক আয়" value={biodata.monthlyIncome ? `৳${biodata.monthlyIncome}` : undefined} />
          <Field label="৫ ওয়াক্ত নামায" value={biodata.fiveTimesPrayer ? 'হ্যাঁ' : 'না'} />
        </Section>

        {biodata.aboutSelf && (
          <div className="mb-6">
            <h3 className="font-bold text-sm mb-2 pb-1 border-b" style={{ color: 'var(--green-dark)' }}>নিজের সম্পর্কে</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{biodata.aboutSelf}</p>
          </div>
        )}

        {biodata.expectedSpouseQualities && (
          <div className="mb-6">
            <h3 className="font-bold text-sm mb-2 pb-1 border-b" style={{ color: 'var(--green-dark)' }}>প্রত্যাশিত সঙ্গী</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{biodata.expectedSpouseQualities}</p>
          </div>
        )}

        {/* Contact info - only after connection accepted */}
        <div className="p-4 bg-gray-50 rounded-xl text-center text-sm text-gray-500 mb-6">
          🔒 যোগাযোগের তথ্য দেখতে কানেকশন অনুরোধ পাঠান।
        </div>

        {/* Action button */}
        <button onClick={sendConnectionRequest} disabled={requested || reqLoading}
          className="w-full py-3 rounded-xl text-white font-semibold hover:opacity-90 disabled:opacity-60 transition"
          style={{ background: 'var(--green)' }}>
          {requested ? '✅ অনুরোধ পাঠানো হয়েছে' : reqLoading ? 'পাঠানো হচ্ছে...' : '🤝 কানেকশন অনুরোধ পাঠান'}
        </button>
      </div>
    </div>
  )
}
