import mongoose from 'mongoose';
const doctorAvailabilitySchema = new mongoose.Schema({
    doctor_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Doctor', 
        required: true,
        index: true 
    },
    date: { 
        type: String, 
        required: true,
        index: true
    },
    start_time: { type: String, required: true }, 
    end_time: { type: String, required: true },
    max_slots: { 
        type: Number, 
        required: true, 
        default: 1,
        min: 1
    },
    is_available: { type: Boolean, default: true },

}, { timestamps: true });

// Ensure ki ek doctor, ek hi date aur time window ke liye duplicate entry na banaye
doctorAvailabilitySchema.index({ doctor_id: 1, date: 1, start_time: 1 }, { unique: true });

const DoctorAvailabilityModel = mongoose.model('DoctorAvailability', doctorAvailabilitySchema);
export default DoctorAvailabilityModel;