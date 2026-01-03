import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password_hash: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'admin', // future-proof for RBAC
    },
}, {
    timestamps: true, // createdAt, updatedAt automatically
});

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;
