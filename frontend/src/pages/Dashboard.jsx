import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [biodata, setBiodata] = useState(null)
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bdRes, connRes] = await Promise.all([
          api.get('/biodata/my'),
          api.get('/connections/my'),
        ])
        setBiodata(bdRes.data.biodata)
        setConnections(connRes.data.connections || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const deleteBiodata = async () => {
    if (!window.confirm('আপনার বায়োডাটা ডিলিট করতে চান?')) return
    await api.delete('/biodata/my')
    setBiodata(null)
  }

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="text-gray-400">লোড হচ্ছে...</div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--green-dark)' }}>ড্যাশবোর্ড</h1>

      {/* User info card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
          style={{ background: 'var(--green)' }}>
          {user?.phone?.slice(-2) || 'U'}
        </div>
        <div>
          <div className="font-bold text-gray-800">{user?.phone}</div>
          <div className="text-sm text-gray-500">সদস্য</div>
        </div>
      </div>

      {/* Biodata status */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-700">আমার বায়োডাটা</h2>
          {!biodata && (
            <Link to="/create-biodata"
              className="text-sm px-4 py-2 rounded-lg text-white font-semibold hover:opacity-90"
              style={{ background: 'var(--green)' }}>
              + তৈরি করুন
            </Link>
          )}
        </div>

        {biodata ? (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[
                { label: 'বায়োডাটা নং', value: `#${biodata.biodataNo}` },
                { label: 'ধরন', value: biodata.type === 'groom' ? 'পাত্র' : 'পাত্রী' },
                { label: 'অবস্থা', value: biodata.status === 'approved' ? '✅ অনুমোদিত' : '⏳ অপেক্ষমাণ' },
                { label: 'বয়স', value: `${biodata.age} বছর` },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl text-center" style={{ background: 'var(--cream)' }}>
                  <div className="text-sm font-bold text-gray-800">{item.value}</div>
                  <div className="text-xs text-gray-500">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Link to="/create-biodata"
                className="text-sm px-4 py-2 rounded-lg border font-semibold hover:bg-gray-50 transition"
                style={{ color: 'var(--green)' }}>
                ✏️ সম্পাদনা
              </Link>
              <button onClick={deleteBiodata}
                className="text-sm px-4 py-2 rounded-lg border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition">
                🗑️ ডিলিট
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-sm">আপনার কোনো বায়োডাটা নেই।</p>
          </div>
        )}
      </div>

      {/* Connections */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-gray-700 mb-4">কানেকশন অনুরোধ</h2>
        {connections.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🤝</div>
            <p className="text-sm">কোনো কানেকশন অনুরোধ নেই।</p>
          </div>
        ) : (
          <div className="space-y-3">
            {connections.map(conn => (
              <div key={conn._id} className="flex items-center justify-between p-3 rounded-xl border">
                <div className="text-sm">
                  <div className="font-medium text-gray-800">বায়োডাটা #{conn.biodataNo}</div>
                  <div className="text-xs text-gray-500">{conn.status === 'pending' ? 'অপেক্ষমাণ' : conn.status === 'accepted' ? '✅ গৃহীত' : '❌ প্রত্যাখ্যাত'}</div>
                </div>
                {conn.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => api.put(`/connections/${conn._id}/accept`).then(() => window.location.reload())}
                      className="text-xs px-3 py-1 rounded-lg text-white" style={{ background: 'var(--green)' }}>গ্রহণ</button>
                    <button onClick={() => api.put(`/connections/${conn._id}/reject`).then(() => window.location.reload())}
                      className="text-xs px-3 py-1 rounded-lg border text-red-600">প্রত্যাখ্যান</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
