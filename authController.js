import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 
import Patient from '../db/Patient.js'; 
import Admin from '../db/Admin.js'; 

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_strong_default_jwt_secret_key'; 
const saltRounds = 10; 

// --- PATIENT REGISTRATION CONTROLLER (SIGN UP) ---
export const registerPatient = async (req, res) => {
    try {
        const { username, email, password, gender, age, phone } = req.body;

        if (!username || !email || !password || !gender || !age || !phone) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        
        const existingPatient = await Patient.findOne({ $or: [{ email }, { username }] });
        if (existingPatient) {
            return res.status(409).json({ message: 'User already exists.' });
        }

        // Salt rounds fixed to 10
        const password_hash = await bcrypt.hash(password, saltRounds);

        const newPatient = new Patient({
            username,
            email,
            password_hash, 
            gender,
            age: parseInt(age, 10),
            phone_number: phone, 
        });

        await newPatient.save();
        
        res.status(201).json({ 
            message: 'Registration successful.', 
            patientId: newPatient._id 
        });

    } catch (error) {
        console.error('Registration Error:', error.message);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};





// --- ADMIN LOGIN CONTROLLER ---
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const adminIdString = admin._id.toString();

        const token = jwt.sign(
            { id: adminIdString, role: 'admin', email: admin.email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        console.log(`[ADMIN LOGIN SUCCESS] Admin: ${admin.username || admin.email}, ID: ${adminIdString}`);

        res.status(200).json({
            message: 'Admin login successful.',
            token,
            admin: {
                id: adminIdString,
                username: admin.username || admin.email,
                email: admin.email,
            }
        });

    } catch (err) {
        console.error('Admin Login Error:', err.message);
        res.status(500).json({ message: 'Server error during admin login.' });
    }
};


// --- PATIENT LOGIN CONTROLLER (LOGIN) ---
export const loginPatient = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        
        const patient = await Patient.findOne({ email });
        if (!patient) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, patient.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 🟢 FIX: .toString() use kiya taaki exact database ID token mein jaye
        const patientIdString = patient._id.toString();

        // 4. Generate JWT Token 🔐
        const token = jwt.sign(
            { id: patientIdString, email: patient.email },
            JWT_SECRET,
            { expiresIn: '1d' } 
        );

        console.log(`[LOGIN SUCCESS] User: ${patient.username}, ID: ${patientIdString}`);

        // 5. Success Response
        res.status(200).json({
            message: 'Login successful.',
            token, 
            user: {
                id: patientIdString,
                username: patient.username,
                email: patient.email,
                gender: patient.gender,
                age: patient.age,
                phone: patient.phone_number, 
            }
        });

    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ message: 'Server error during login.' });
    }
};