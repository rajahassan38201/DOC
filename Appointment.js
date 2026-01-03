import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    // Patient ka reference
  patient_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Patient', 
        required: true 
    },
    // Doctor ka reference
    doctor_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Doctor', 
        required: true,
        index: true
    },

    // CRITICAL: Woh exact Date object jo 40-minute sub-slot ko define karta hai. 
    // Isse hi capacity aur duplicate check kiya jata hai.
    start_time_ts: { 
        type: Date, 
        required: true,
        index: true // Querying ke liye zaroori
    },
    
    // Slot ka aakhri waqt (Calculation ke liye)
    end_time_ts: { type: Date, required: true },

    // Kis Availability template se yeh slot generate hua tha (Link to Slot 2)
    availability_slot_ref: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'DoctorAvailability',
        required: true
    },

    // Booking ki haalat (Confirmed, Pending, Cancelled, Completed)
    status: { 
        type: String, 
        enum: ['Confirmed', 'Pending', 'Cancelled', 'Completed'],
        default: 'Confirmed'
    },
    
    type: { type: String, default: 'OPD' },
    reason: { type: String },

}, { timestamps: true });


// ---------------------------------------------------------------------
// CRITICAL INDEX FOR DUPLICATE CHECK AND CAPACITY CHECK
// ---------------------------------------------------------------------

// Is index se do zaroori cheezein ek hi query mein ho jati hain:
// 1. **Capacity Check:** Yeh index doctor_id aur start_time_ts par tezi se appointments ginne (countDocuments) mein madad karta hai.
// 2. **Duplicate Check (Aapki Pehli Chinta):** Yeh index ensure karta hai ki ek hi patient_id, ek doctor ke saath, ek hi start_time_ts par do baar 'Confirmed' ya 'Pending' status mein na ho.
appointmentSchema.index(
    { patient_id: 1, doctor_id: 1, start_time_ts: 1 }, 
    { 
        unique: true, 
        partialFilterExpression: { status: { $in: ['Confirmed', 'Pending'] } } 
    }
);


const AppointmentModel = mongoose.model('Appointment', appointmentSchema);
export default AppointmentModel;