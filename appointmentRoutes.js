import express from 'express';

// Controllers
import { 
    getDoctorById, 
    getDoctorAvailability, 
    bookAppointment 
} from '../controllers/appointmentController.js';

// ✅ REAL JWT AUTH MIDDLEWARE
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * ----------------------------------------
 * APPOINTMENT ROUTES (PROTECTED)
 * ----------------------------------------
 * NOTE:
 * - Yahan koi dummy / test middleware NAHI hai
 * - req.user.id sirf JWT token se aayegi
 * - Patient ID mismatch bug fully FIXED
 */

// GET doctor details
router.get('/doctors/:id', protect, getDoctorById);

// GET doctor availability for a specific date
router.get('/availability/:doctorId/:date', protect, getDoctorAvailability);

// POST book an appointment
router.post('/book', protect, bookAppointment);

export default router;
