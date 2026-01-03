import mongoose from 'mongoose';

// --- New Sub-Schema for Recurring Weekly Schedule ---
// Yeh define karta hai ki doctor har hafte kis din kis time available rehte hain.
const WeeklyScheduleSchema = new mongoose.Schema({
    day_of_week: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    start_time: { type: String, required: true }, // e.g., "10:00"
    end_time: { type: String, required: true },   // e.g., "14:00"
    is_opd: { type: Boolean, default: true }      // Clinic visit ya tele-consultation
}, { _id: false });
// ----------------------------------------------------


const DoctorSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    title: { type: String },
    role: { type: String, required: true }, // specialization like Cardiologist, GP, etc.
    symptoms: [{ type: String }], // array of symptoms for matching user query

    // NAYA FIELD: Recurring availability pattern (Isse DoctorAvailability records generate honge)
    weekly_schedule_template: [WeeklyScheduleSchema],

    contact: { type: String },      // frontend display / extension number

    medical_license_number: { type: String, unique: true, sparse: true },
    credentials: { type: String },
    office_phone: { type: String },

    // SPECIALIZATIONS (References) - optional if you still want a Specialization collection
    specialty_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialization'
    }],

    // PATIENT REVIEWS (Embedded Array)
    reviews: [{
        patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
        rating: { type: Number, min: 1, max: 5 },
        review_text: { type: String },
        timestamp: { type: Date, default: Date.now }
    }],

    // ACHIEVEMENTS (Embedded Array)
    achievements: [{
        type: { type: String, enum: ['Article', 'Award', 'Publication'] },
        title: { type: String },
        date_published: { type: Date },
        url: { type: String }
    }]
}, {
    timestamps: true
});

// Full name virtual field
DoctorSchema.virtual('name').get(function () {
    return `${this.first_name} ${this.last_name}`;
});

const Doctor = mongoose.model('Doctor', DoctorSchema);

export default Doctor;