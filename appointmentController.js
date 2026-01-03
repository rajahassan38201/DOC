import mongoose from 'mongoose';
// Note: 'Appointment' import is kept for clarity, but the code fetches models via mongoose.model()
import Appointment from '../db/Appointment.js'; 

// Slot duration in minutes, must match the granularity used in the system
const SLOT_DURATION_MINUTES = 40; 

// ----------------------------------------------------
// Doctor Availability controller
// ----------------------------------------------------
export const getDoctorAvailability = async (req, res) => {
    // LOG 1: Function entry and received parameters
    console.log(`[getDoctorAvailability] Request received for Doctor: ${req.params.doctorId} on Date: ${req.params.date}`);
    
    try {
        const { doctorId, date } = req.params;

        // --- Input Validation ---
        if (!mongoose.Types.ObjectId.isValid(doctorId)) {
            console.log(`[getDoctorAvailability] Validation Error: Invalid Doctor ID format: ${doctorId}`);
            return res.status(400).json({ message: "Invalid Doctor ID format." });
        }
        
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            console.log(`[getDoctorAvailability] Validation Error: Invalid date format: ${date}`);
            return res.status(400).json({ message: "Invalid date format." });
        }

        // Calculate day name for weekly schedule check (e.g., Monday, Tuesday)
        const weekday = parsedDate.toLocaleString("en-US", { weekday: "long" });
        console.log(`[getDoctorAvailability] Calculated Weekday: ${weekday}`);

        // --- Fetch DoctorAvailability Model ---
        // Assuming DoctorAvailability model is registered elsewhere
        const DoctorAvailabilityModel = mongoose.model('DoctorAvailability');

        // Convert doctorId string to Mongoose ObjectId object for proper DB matching
        const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

        const queryParams = {
            doctor_id: doctorObjectId, 
            day_of_week: weekday,
            is_available: true
        };
        console.log(`[getDoctorAvailability] Running Query with Parameters:`, queryParams);

        // --- Fetch Availability Template (The doctor's schedule for that day) ---
        const templateSlots = await DoctorAvailabilityModel.find(queryParams).lean();

        // LOG 2: Template slots result
        console.log(`[getDoctorAvailability] Found ${templateSlots.length} availability templates.`);
        if (!templateSlots || templateSlots.length === 0) {
            return res.status(200).json({ 
                message: "Doctor not available on this weekday.",
                slots: [] 
            });
        }

        const bookableSlots = [];
        const today = new Date();

        // --- Generate and Check Sub-Slots (40-min slots) ---
        for (const slot of templateSlots) { 
            console.log(`[getDoctorAvailability] Processing template slot ID: ${slot._id} from ${slot.start_time} to ${slot.end_time}. Max slots: ${slot.max_slots}`);
            
            // Create full Date objects for comparison
            let currentSlotStart = new Date(`${date}T${slot.start_time}:00`);
            const windowEnd = new Date(`${date}T${slot.end_time}:00`);
            
            // Generate 40-minute sub-slots within the availability window
            while (currentSlotStart < windowEnd) {
                const currentSlotEnd = new Date(currentSlotStart.getTime() + SLOT_DURATION_MINUTES * 60000);
                
                if (currentSlotEnd > windowEnd) break;

                // Check if the slot is in the future
                if (currentSlotStart > today) { 
                    
                    // --- Count existing appointments for this specific 40-min slot ---
                    const AppointmentModel = mongoose.model('Appointment');
                    
                    const existingAppointments = await AppointmentModel.countDocuments({
                        doctor_id: doctorId, // Assuming Appointment schema stores doctor_id as string/ObjectID
                        start_time_ts: currentSlotStart,
                        status: { $in: ['Confirmed', 'Pending'] }
                    });
                    
                    const isBooked = existingAppointments >= slot.max_slots;
                    
                    // LOG 3: Slot check details
                    console.log(`[getDoctorAvailability] Slot ${currentSlotStart.toISOString()} -> Booked Count: ${existingAppointments}/${slot.max_slots}. Bookable: ${!isBooked}`);
                    
                    if (!isBooked) {
                        bookableSlots.push({
                            availabilitySlotRef: slot._id, 
                            start_time_ts: currentSlotStart.toISOString(), 
                            end_time_ts: currentSlotEnd.toISOString(),
                            display_time: `${currentSlotStart.toTimeString().substring(0,5)} - ${currentSlotEnd.toTimeString().substring(0,5)}`
                        });
                    }
                }
                currentSlotStart = currentSlotEnd; // Move to the next 40-minute slot
            }
        } 

        // LOG 4: Final slots summary
        console.log(`[getDoctorAvailability] Final count of bookable slots: ${bookableSlots.length}`);


        if (bookableSlots.length === 0) {
            return res.status(200).json({ message: "All available slots are either fully booked or in the past.", slots: [] });
        }
        
        // --- Successful Response ---
        return res.status(200).json({
            message: "Slots fetched successfully",
            weekday,
            slots: bookableSlots.sort((a, b) => new Date(a.start_time_ts) - new Date(b.start_time_ts))
        });

    } catch (err) {
        // LOG 5: Catch block error
        console.error(`[getDoctorAvailability] CRITICAL Error fetching availability:`, err.message, err.stack);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// ----------------------------------------------------
// Appointment booking controller
// ----------------------------------------------------
export const bookAppointment = async (req, res) => {
    // 🔴 CRITICAL FIX: Middleware ne pehle hi verify kar liya hai, sirf use karein
    console.log("-----------------------------------------");
    console.log("[BOOKING ATTEMPT]");
    console.log("Final Authorized ID to be used:", req.user.id);
    console.log("-----------------------------------------");

    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Authentication failed. Token data missing." });
    }

    const { doctorId, startTimeTs, endTimeTs, type, reason, availabilitySlotRef } = req.body;

    // Validate inputs
    if (!doctorId || !startTimeTs || !availabilitySlotRef) {
        return res.status(400).json({ message: "Required fields are missing." });
    }

    const session = await mongoose.startSession();
    try {
        let newAppointment;
        await session.withTransaction(async () => {
            const AppointmentModel = mongoose.model('Appointment');
            const DoctorAvailabilityModel = mongoose.model('DoctorAvailability');

            // Explicitly use the ID from req.user (which was verified in middleware)
            const patientId = new mongoose.Types.ObjectId(req.user.id);
            const bookingStartTime = new Date(startTimeTs);

            // Capacity Check
            const availabilityTemplate = await DoctorAvailabilityModel.findById(availabilitySlotRef).session(session);
            if (!availabilityTemplate) throw new Error("Availability slot not found.");

            const bookedCount = await AppointmentModel.countDocuments({
                doctor_id: doctorId,
                start_time_ts: bookingStartTime,
                status: { $in: ['Confirmed', 'Pending'] }
            }).session(session);

            if (bookedCount >= availabilityTemplate.max_slots) {
                throw new Error("This slot is now full. Please pick another one.");
            }

            // Create Appointment
            newAppointment = new AppointmentModel({ 
                patient_id: patientId, 
                doctor_id: new mongoose.Types.ObjectId(doctorId),
                start_time_ts: bookingStartTime,
                end_time_ts: new Date(endTimeTs),
                status: 'Confirmed',
                type: type || 'OPD',
                reason: reason || 'Routine Checkup',
                availability_slot_ref: availabilitySlotRef
            });

            await newAppointment.save({ session });
            console.log(`[DB SUCCESS] Appointment created for: ${patientId}`);
        });

        await session.endSession();
        res.status(201).json({ message: "Appointment booked successfully!", appointment: newAppointment });

    } catch (err) {
        if (session.active) await session.endSession();
        console.error("[BOOKING ERROR]:", err.message);
        res.status(409).json({ message: err.message });
    }
};
// ----------------------------------------------------
// Doctor info controller
// ----------------------------------------------------
export const getDoctorById = async (req, res) => {
    const { id } = req.params;
    console.log(`[getDoctorById] Request received for Doctor ID: ${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log(`[getDoctorById] Validation Error: Invalid Doctor ID format: ${id}`);
        return res.status(400).json({ message: "Invalid Doctor ID format." });
    }

    try {
        const doctor = await mongoose.model('Doctor').findById(id)
            .select('-reviews -achievements -__v').lean();
            
        if (!doctor) {
            console.log(`[getDoctorById] Doctor ID ${id} not found.`);
            return res.status(404).json({ message: "Doctor nahi mila" });
        }
        
        console.log(`[getDoctorById] Successfully fetched Doctor: ${doctor.first_name} ${doctor.last_name}`);
        return res.status(200).json({ doctor });
    } catch (err) {
        console.error("[getDoctorById] Error fetching doctor:", err.message);
        return res.status(500).json({ message: "Server error fetching doctor details." });
    }
};