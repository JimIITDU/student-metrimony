import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
  country: { type: String, default: 'বাংলাদেশ' },
  division: String,
  district: String,
  upazila: String,
}, { _id: false })

const biodataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  biodataNo: {
    type: Number,
    unique: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  rejectionReason: String,

  // Basic
  type: {
    type: String,
    enum: ['groom', 'bride'],
    required: true,
  },
  age: { type: Number, required: true, min: 18, max: 70 },
  height: String,
  complexion: {
    type: String,
    enum: ['কালো', 'শ্যামলা', 'উজ্জ্বল শ্যামলা', 'ফর্সা', 'উজ্জ্বল ফর্সা', ''],
    default: '',
  },
  maritalStatus: {
    type: String,
    enum: ['অবিবাহিত', 'বিবাহিত', 'ডিভোর্সড', 'বিধবা', 'বিপত্নীক'],
    default: 'অবিবাহিত',
  },
  permanentAddress: addressSchema,
  currentAddress: addressSchema,

  // Education
  education: String,
  educationMedium: {
    type: String,
    enum: ['general', 'quomi', 'aliya'],
    default: 'general',
  },
  islamicEducation: String,

  // Religious
  fiveTimesPrayer: { type: Boolean, default: true },
  beard: String,        // for groom
  hijab: String,        // for bride
  madhab: {
    type: String,
    enum: ['হানাফি', 'মালিকি', 'শাফিঈ', 'হাম্বলি', 'আহলে হাদীস / সালাফি', ''],
    default: '',
  },

  // Career
  occupation: String,
  monthlyIncome: Number,

  // Family
  guardianName: String,
  guardianPhone: String,
  fatherOccupation: String,
  motherOccupation: String,
  siblings: String,
  familyType: {
    type: String,
    enum: ['উচ্চবিত্ত', 'উচ্চ মধ্যবিত্ত', 'মধ্যবিত্ত', 'নিম্ন মধ্যবিত্ত', 'নিম্নবিত্ত', ''],
    default: '',
  },
  aboutFamily: String,

  // Marriage expectations
  expectedSpouseQualities: String,
  willLiveWithParents: String,
  aboutSelf: String,

  // Special categories
  categories: [{
    type: String,
    enum: ['প্রতিবন্ধী', 'বন্ধ্যা', 'নওমুসলিম', 'এতিম', '২য় স্ত্রী হতে আগ্রহী', 'তাবলীগ'],
  }],

  agreedToTerms: { type: Boolean, default: false },

  // View count
  views: { type: Number, default: 0 },

}, { timestamps: true })

// Auto-generate biodata number
biodataSchema.pre('save', async function (next) {
  if (this.isNew) {
    const last = await this.constructor.findOne({}, {}, { sort: { biodataNo: -1 } })
    this.biodataNo = last ? last.biodataNo + 1 : 1001
  }
  next()
})

export default mongoose.model('Biodata', biodataSchema)
