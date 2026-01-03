const ConversationSchema = new mongoose.Schema({
    patient_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Patient', 
        required: true 
    },
    start_time: { type: Date, default: Date.now },
    end_time: { type: Date },
    is_escalated: { type: Boolean, default: false }, // FE-2.2.2
    escalated_to_staff_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Staff', 
        default: null 
    },
    
    // MESSAGES (Embedded Array)
    messages: [{
        sender_type: { type: String, enum: ['Bot', 'User'], required: true },
        message_text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        nlp_intent: { type: String },
        nlp_entities: { type: mongoose.Schema.Types.Mixed } // Flexible JSON data
    }]
});

// module.exports = mongoose.model('Conversation', ConversationSchema);