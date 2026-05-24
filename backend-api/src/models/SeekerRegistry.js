const mongoose = require('mongoose');

const SeekerRegistrySchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true, index: true },
  role: { type: String, default: 'seeker', immutable: true },
  isVerified: { type: Boolean, default: false },
  fullName: { type: String, default: "" },
  aadhaarUIDMasked: { type: String, default: "" }, // Stores a strictly secure/masked layout representation
  meeSevaVerified: { type: Boolean, default: false },
  nativePlace: { type: String, default: "" },
  
  // Hardlocked to Prakasam for regional tracking
  district: { 
    type: String, 
    enum: ['Prakasam'],
    default: 'Prakasam',
    required: true
  },
  
  // Added to map directly with the new frontend mandal state payload
  mandal: {
    type: String,
    enum: [
      'Ardhaveedu', 'Ballikurava', 'Bestavaripeta', 'Chandra Sekhara Puram', 'Chimakurthi', 
      'Cumbum', 'Darsi', 'Donakonda', 'Giddalur', 'Hanumanthuni Padu', 'Inkollu', 
      'Janakavarampanguluru', 'Kambham', 'Kanigiri', 'Karamchedu', 'Kondapi', 'Korisapadu', 
      'Kotha Patnam', 'Kurichedu', 'Lingasamudram', 'Maddipadu', 'Markapur', 'Marripudi', 
      'Mundlamuru', 'Naguluppala Padu', 'Ongole', 'Pamur', 'Parchur', 'Podili', 
      'Ponnaluru', 'Pullalacheruvu', 'Racherla', 'Santhanuthala Padu', 'Singarayakonda', 
      'Tarlupadu', 'Tallur', 'Tangutur', 'Tripuranthakam', 'Veligandla', 'Yerragondapalem'
    ],
    required: true,
    index: true // Indexed for fast aggregation groupings in the Management Portal analytics
  },
  
  casteCategory: { 
    type: String, 
    enum: ['OC', 'BC-A', 'BC-B', 'BC-C', 'BC-D', 'BC-E', 'SC', 'ST'], 
    required: true 
  },
  subCaste: { type: String, default: "" },
  qualification: {
    degree: { type: String, default: "" },
    specialization: { type: String, default: "" },
    institution: { type: String, default: "" },
    passingYear: { type: Number, default: 2026 }
  },
  skills: [{ type: String, index: true }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SeekerRegistry', SeekerRegistrySchema, 'seekers');