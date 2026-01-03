const mongoose = require('mongoose');

const AdminUserSchema = new mongoose.Schema({
    // LOGIN AND AUTHENTICATION FIELDS
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    email: { // Optional, but good for recovery/communication
        type: String,
        unique: true,
        sparse: true // Allows multiple documents to have a null/missing email
    },
    password_hash: { // Password ko hamesha hash karke store karna hai
        type: String, 
        required: true 
    },
    
    // PERMISSIONS AND ROLES (FE-7.1.1)
    role: { 
        type: String, 
        enum: ['SuperAdmin', 'ContentManager', 'StaffEscalation', 'SystemMonitor'], // Different access levels
        required: true,
        default: 'StaffEscalation'
    },
    
    // ADMIN METADATA
    first_name: { type: String },
    last_name: { type: String },
    is_active: { type: Boolean, default: true },
    last_login: { type: Date },

    // REFERENCES (Optional, system logs tracking ke liye)
    // Note: Staff collection ka kaam mainly doctor profile management aur chat escalation hai.
    // Agar ye user bhi doctor hai, to 'Doctor' collection ko reference kar sakte hain.
    
}, {
    timestamps: true // Tracks when the user was created and last updated
});

// module.exports = mongoose.model('AdminUser', AdminUserSchema);