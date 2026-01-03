// File: routes/authRoutes.js

import express from 'express';
// controllers folder mein file ka naam authController.js hona chahiye
import { loginAdmin,registerPatient, loginPatient } from '../controllers/authController.js'; 

const router = express.Router();

router.post('/register-patient', registerPatient); 
router.post('/patient-login', loginPatient); 
router.post('/admin-login', loginAdmin);

export default router;