import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Models
import Patient from './db/Patient.js';
import Doctor from './db/Doctor.js';
import Appointment from './db/Appointment.js';
import DoctorAvailability from './db/DoctorAvailability.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';

// 🔴 IMPORT PROTECT: Sirf ek jagah se import karein
import { protect } from './middlewares/authMiddleware.js';

const app = express();
const port = 3001;

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB Connected!"))
    .catch(err => console.error("❌ MongoDB Error:", err.message));

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Public Routes ---
app.use('/api/auth', authRoutes);

// --- 1. CHATBOT (No protect needed usually) ---

        

app.post('/api/chat', async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query required." });

    try {
        // 1. Fetch data including weekly_schedule_template
        const doctors = await Doctor.find({}, 'first_name last_name specialty symptoms_expertise weekly_schedule_template').lean();

        const doctorsContext = doctors.map(doc => 
            `Doctor ID: ${doc._id}
             Name:  ${doc.first_name} ${doc.last_name}
             Specialty: ${doc.specialty}
             Symptoms they treat: ${doc.symptoms_expertise.join(", ")}`
        ).join("\n\n");

        const model = genAI.getGenerativeModel({ model: "gemini-robotics-er-1.5-preview" });

        const prompt = `
            You are a medical assistant. Based on these doctors and their "symptoms_expertise", find the best match for the user.
            
            Doctors List:
            ${doctorsContext}

            User Query: "${query}"

            Return ONLY JSON:
            {
                "doctorId": "id_here",
                "reason": "short explanation"
            }
        `;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text().trim();
        
        if (responseText.startsWith("```json")) {
            responseText = responseText.replace(/```json|```/g, "").trim();
        }

        const aiRecommendation = JSON.parse(responseText);

        if (!aiRecommendation.doctorId) {
            return res.json({ response: "Koi munasib doctor nahi mila.", doctorId: null });
        }

        // 2. Find the matched doctor from our list
        const matchedDoctor = doctors.find(d => d._id.toString() === aiRecommendation.doctorId);

        // 3. Send back the response with the schedule
        res.json({ 
            response: `Recommended: ${matchedDoctor.first_name} (${matchedDoctor.specialty}). ${aiRecommendation.reason}`, 
            doctorId: matchedDoctor._id,
            schedule: matchedDoctor.weekly_schedule_template // Ye array ab user ko mil jayegi
        });

    } catch (err) {
        console.error("Chatbot Error:", err.message);
        res.status(500).json({ error: "Gemini AI processing error." });
    }
});
// --- 2. PROTECTED PROFILE ROUTES ---
app.get('/api/profile', protect, async (req, res) => {
    try {
        const patient = await Patient.findById(req.user.id).select('-password_hash');
        if (!patient) return res.status(404).json({ message: "User not found." });
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: "Server error." });
    }
});

app.get('/api/doctors/:doctorId', protect, async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.doctorId.trim()).lean(); 
        if (!doctor) return res.status(404).json({ message: "Doctor not found." });
        res.json({ message: "Doctor info fetched", doctor });
    } catch (err) {
        res.status(500).json({ message: "Server error." });
    }
});

// --- 3. PROTECTED ADMIN ROUTES ---
app.get('/api/admin/appointments', protect, async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate({ path: 'patient_id', select: 'username email', model: 'Patient' })
            .populate({ path: 'doctor_id', select: 'first_name last_name', model: 'Doctor' })
            .sort({ start_time_ts: 1 });
        res.json(appointments);
    } catch (err) {
        console.error("Admin Fetch Error:", err);
        res.status(500).json({ message: "Error fetching appointments" });
    }
});

app.patch('/api/admin/update-slot/:id', protect, async (req, res) => {
    const { id } = req.params; 
    const { newStartTime, newEndTime, availabilitySlotRef } = req.body;

    const session = await mongoose.startSession();
    try {
        let updatedAppointment;
        await session.withTransaction(async () => {
            const AppointmentModel = mongoose.model('Appointment');
            const DoctorAvailabilityModel = mongoose.model('DoctorAvailability');

            const oldAppointment = await AppointmentModel.findById(id).session(session);
            if (!oldAppointment) throw new Error("Appointment nahi mili.");

            const doctorId = oldAppointment.doctor_id;
            const bookingStartTime = new Date(newStartTime);

            const availabilityTemplate = await DoctorAvailabilityModel.findById(availabilitySlotRef).session(session);
            if (!availabilityTemplate) throw new Error("Slot invalid hai.");

            const bookedCount = await AppointmentModel.countDocuments({
                doctor_id: doctorId,
                start_time_ts: bookingStartTime,
                status: { $in: ['Confirmed', 'Pending'] },
                _id: { $ne: id } 
            }).session(session);

            if (bookedCount >= availabilityTemplate.max_slots) {
                throw new Error("Yeh slot full hai.");
            }

            updatedAppointment = await AppointmentModel.findByIdAndUpdate(
                id,
                {
                    start_time_ts: bookingStartTime,
                    end_time_ts: new Date(newEndTime),
                    availability_slot_ref: availabilitySlotRef,
                    status: 'Confirmed'
                },
                { session, new: true }
            );
        });
        await session.endSession();
        res.json({ success: true, data: updatedAppointment });
    } catch (err) {
        if (session.active) await session.endSession();
        res.status(400).json({ success: false, error: err.message });
    }
});

/**
 * @route   GET /api/doctors
 * @desc    Get all doctors with their schedule and profile details
 * @access  Public/Protected (As per your need)
 */
app.get('/api/doctors', async (req, res) => {
    try {
        // Hum saare doctors fetch kar rahe hain aur virtuals (full name) ko bhi include kar rahe hain
        const doctors = await Doctor.find({})
            .select('-medical_license_number') // Security ke liye license number hide kar sakte hain
            .sort({ first_name: 1 });

        if (!doctors || doctors.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(doctors);
    } catch (err) {
        console.error("Fetch Doctors Error:", err.message);
        res.status(500).json({ 
            success: false, 
            message: "Doctors list fetch karne mein error aaya." 
        });
    }
});

// --- 4. APPOINTMENT SYSTEM ROUTES ---
app.use('/api/appointments', appointmentRoutes);

app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));