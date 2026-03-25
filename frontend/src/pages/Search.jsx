import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../utils/api'

const occupations = ['ইমাম','মাদ্রাসা শিক্ষক','শিক্ষক','ইঞ্জিনিয়ার','ব্যবসায়ী','সরকারী চাকুরী','বেসরকারী চাকুরী','ফ্রিল্যান্সার','ডাক্তার','শিক্ষার্থী','প্রবাসী','অন্যান্য']
const maritalStatuses = ['অবিবাহিত','বিবাহিত','ডিভোর্সড','বিধবা','বিপত্নীক']

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [biodatas, setBiodatas] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    maritalStatus: '',
    minAge: '',
    maxAge: '',
    occupation: '',
    division: '',
  })

  const fetchBiodatas = async (pg = 1) => {
    setLoading(true)
    try {
      const params = { ...filters, page: pg, limit: 12 }
      Object.keys(params).forEach(k => !params[k] && delete params[k])
      const res = await api.get('/biodata', { params })
      setBiodatas(res.data.biodatas)
      setTotal(res.data.total)
      setPage(pg)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBiodatas(1) }, [])

  const handleFilter = (e) => {
    e.preventDefault()
    fetchBiodatas(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--green-dark)' }}>বায়োডাটা খুঁজুন</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <form onSubmit={handleFilter} className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
            <h2 className="font-bold text-gray-700">ফিল্টার</h2>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">আমি খুঁজছি</label>
              <select value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}
                className="w-full border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">সকল</option>
                <option value="groom">পাত্রের বায়োডাটা</option>
                <option value="bride">পাত্রীর বায়োডাটা</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">বৈবাহিক অবস্থা</label>
              <select value={filters.maritalStatus} onChange={e => setFilters({...filters, maritalStatus: e.target.value})}
                className="w-full border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">সকল</option>
                {maritalStatuses.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">বয়স</label>
              <div className="flex gap-2">
                <input type="number" placeholder="থেকে" min={18} max={60}
                  value={filters.minAge} onChange={e => setFilters({...filters, minAge: e.target.value})}
                  className="w-full border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                <input type="number" placeholder="পর্যন্ত" min={18} max={60}
                  value={filters.maxAge} onChange={e => setFilters({...filters, maxAge: e.target.value})}
                  className="w-full border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">পেশা</label>
              <select value={filters.occupation} onChange={e => setFilters({...filters, occupation: e.target.value})}
                className="w-full border rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">সকল</option>
                {occupations.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <button type="submit"
              className="w-full py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
              style={{ background: 'var(--green)' }}>
              খুঁজুন
            </button>

            <button type="button"
              onClick={() => { setFilters({ type:'', maritalStatus:'', minAge:'', maxAge:'', occupation:'', division:'' }); fetchBiodatas(1) }}
              className="w-full py-2 rounded-xl text-gray-600 text-sm border hover:bg-gray-50 transition">
              ফিল্টার মুছুন
            </button>
          </form>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">মোট {total} টি বায়োডাটা পাওয়া গেছে</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_,i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-3 w-2/3" />
                  <div className="h-3 bg-gray-100 rounded mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : biodatas.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-3">🔍</div>
              <p>কোনো বায়োডাটা পাওয়া যায়নি</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {biodatas.map(b => (
                  <Link key={b._id} to={`/biodata/${b._id}`}
                    className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition block">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
                        style={{ background: b.type === 'groom' ? 'var(--green)' : '#c084fc' }}>
                        {b.type === 'groom' ? '♂' : '♀'}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-gray-800">বায়োডাটা #{b.biodataNo}</div>
                        <div className="text-xs text-gray-500">{b.type === 'groom' ? 'পাত্র' : 'পাত্রী'}</div>
                      </div>
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${b.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {b.status === 'approved' ? 'অনুমোদিত' : 'অপেক্ষমাণ'}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-500">
                      <div>🎂 বয়স: {b.age} বছর</div>
                      <div>💼 পেশা: {b.occupation}</div>
                      <div>📍 {b.permanentAddress?.division || 'অজানা'}</div>
                      <div>💍 {b.maritalStatus}</div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-2 mt-8">
                {page > 1 && (
                  <button onClick={() => fetchBiodatas(page-1)}
                    className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50">← আগের পাতা</button>
                )}
                <span className="px-4 py-2 text-sm text-gray-500">{page} / {Math.ceil(total/12)}</span>
                {page < Math.ceil(total/12) && (
                  <button onClick={() => fetchBiodatas(page+1)}
                    className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50">পরের পাতা →</button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
