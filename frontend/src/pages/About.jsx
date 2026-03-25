export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--green-dark)' }}>আমাদের সম্পর্কে</h1>

      <div className="bg-white rounded-2xl shadow-sm p-8 space-y-5 text-gray-700 leading-relaxed">
        <p>
          <strong style={{ color: 'var(--green)' }}>অর্ধেকদ্বীন</strong> হলো বাংলাদেশের সবচেয়ে বড় ইসলামিক ম্যাট্রিমনি প্ল্যাটফর্ম।
          ২০২১ সালের ১ জানুয়ারি থেকে এই ওয়েবসাইটের যাত্রা শুরু হয়।
        </p>
        <p>
          আমাদের লক্ষ্য হলো প্র্যাকটিসিং মুসলিম পাত্র-পাত্রীদের একটি নিরাপদ ও বিশ্বস্ত প্ল্যাটফর্মে সংযুক্ত করা,
          যেখানে উভয় পক্ষের অভিভাবকরা সক্রিয়ভাবে অংশগ্রহণ করেন।
        </p>
        <p>
          এখানে উপজেলা ভিত্তিক প্রেক্টিসিং মুসলিম পাত্রপাত্রীর বায়োডাটা খোঁজা ও
          অভিভাবকের সাথে যোগাযোগ করা যায়। একই সাথে পাত্র-পাত্রী চাইলে ওয়েবসাইটে
          বায়োডাটা তৈরি করে জমা দিতে পারে।
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          {[
            { num: '৩০,০০০+', label: 'বায়োডাটা' },
            { num: '৫,০০০+', label: 'সফল বিবাহ' },
            { num: '৫০+', label: 'দেশ' },
            { num: '২০২১', label: 'সাল থেকে' },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 rounded-xl" style={{ background: 'var(--cream)' }}>
              <div className="text-xl font-bold" style={{ color: 'var(--green)' }}>{item.num}</div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>

        <p>
          আমরা বিশ্বাস করি বিয়ে একটি ইবাদত এবং প্রতিটি মুসলিমের জন্য একটি গুরুত্বপূর্ণ দায়িত্ব।
          আমাদের প্ল্যাটফর্ম সম্পূর্ণ বিনামূল্যে এবং ইসলামিক নীতি মেনে পরিচালিত হয়।
        </p>
      </div>
    </div>
  )
}
