import mongoose from 'mongoose'

const PatientSchema = new mongoose.Schema({
    // PROFILE FIELDS (Updated)
    username: { 
        type: String, 
        required: true,
        unique: true, // Assuming username should be unique
        trim: true
    },
    // first_name aur last_name ki jagah humne username use kiya hai for simplicity.
    
    // LOGIN FIELDS
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true, 
        trim: true
    },
    password_hash: { 
        type: String, 
        required: true 
    },
    
    // NEW PROFILE DATA FROM SIGNUP
    gender: { 
        type: String, 
        enum: ['Male', 'Female', 'Other'], // Only allows these values
        required: true 
    },
    age: { 
        type: Number, 
        required: true,
        min: 1 // Age cannot be less than 1
    },
    
    // OTHER FIELDS
    phone_number: { type: String, default: null },
    preferred_language: { type: String, default: 'en' }, 

    // REFERENCES
    conversations: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Conversation' 
    }],
    appointments: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Appointment' 
    }]
}, { timestamps: true }); // Acha practice hai registration date track karna

const Patient = mongoose.model('Patient', PatientSchema);
export default Patient;