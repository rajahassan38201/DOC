import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from './src/db/Admin.js'; // Admin model path check kar lo

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/your-db-name';
const DEFAULT_ADMIN = {
    username: 'superadmin',
    email: 'admin@hospital.com',
    password: 'Admin@123', // Default password (change later)
};

const seedAdmin = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected.');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: DEFAULT_ADMIN.email });
        if (existingAdmin) {
            console.log('⚠️ Admin already exists. Skipping seed.');
            process.exit(0);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);

        const admin = new Admin({
            username: DEFAULT_ADMIN.username,
            email: DEFAULT_ADMIN.email,
            password_hash: hashedPassword,
        });

        await admin.save();
        console.log('✅ Admin seeded successfully!');
        console.log(`Email: ${DEFAULT_ADMIN.email}`);
        console.log(`Password: ${DEFAULT_ADMIN.password}`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding admin:', err);
        process.exit(1);
    }
};

seedAdmin();
