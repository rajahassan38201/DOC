import React, { useState, useEffect } from 'react';
import { 
    UserCircle, 
    SquarePen, 
    Save, 
    X, 
    Loader2, 
    Phone, 
    Mail,
    ShieldCheck,
    Calendar,
    AlertCircle,
    Database,
    Hash,
    ChevronRight
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:3001/api';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(null); 
    const [editFormData, setEditFormData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAuthorizedFetchOptions = (method = 'GET', body = null) => {
        const token = localStorage.getItem('userToken');
        if (!token) throw new Error("Please login to access your profile.");

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.trim()}`
            }
        };
        if (body) options.body = JSON.stringify(body);
        return options;
    };

    const loadProfile = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const options = getAuthorizedFetchOptions('GET');
            const response = await fetch(`${API_BASE_URL}/profile`, options);
            const data = await response.json();

            if (response.status === 401) {
                localStorage.removeItem('userToken'); 
                throw new Error('Session expired. Please log in again.');
            }
            if (!response.ok) throw new Error(data.message || 'Failed to fetch profile.');
            
            setUserData(data);
            setEditFormData(data); 
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const options = getAuthorizedFetchOptions('PUT', editFormData);
            const response = await fetch(`${API_BASE_URL}/profile`, options);
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to update.');
            setUserData(result.patient || result); 
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []); 

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    if (isLoading && !userData) { 
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <Loader2 className="w-10 h-10 text-[#40a9ff] animate-spin" />
                <p className="text-gray-400 mt-4 font-medium animate-pulse">Loading Patient Data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 text-center max-w-md w-full">
                    <AlertCircle className="text-[#f30004] w-12 h-12 mx-auto mb-4" />
                    <h2 className="text-gray-900 font-bold text-xl mb-2">Access Error</h2>
                    <p className="text-gray-500 mb-6 text-sm">{error}</p>
                    <button 
                        onClick={() => window.location.href = '/login'} 
                        className="w-full bg-[#f30004] text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Header / Breadcrumb */}
            <div className="border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <span>Dashboard</span>
                    <ChevronRight size={12} />
                    <span className="text-[#40a9ff]">Patient Profile</span>
                </div>
            </div>

            <main className="max-w-6xl mx-auto py-10 px-6">
                <div className="grid lg:grid-cols-12 gap-10">
                    
                    {/* Left Panel: Identity */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-10 space-y-6">
                            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                                <div className="h-24 bg-gradient-to-r from-[#40a9ff] to-[#f30004] opacity-80" />
                                <div className="px-6 pb-8 text-center">
                                    <div className="relative inline-block">
                                        <div className="w-28 h-28 bg-white rounded-3xl p-1 shadow-lg -mt-14 mb-4 border border-gray-100">
                                            <div className="w-full h-full bg-gray-50 rounded-2xl flex items-center justify-center">
                                                <UserCircle className="text-gray-300 w-14 h-14" />
                                            </div>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">{userData?.username}</h2>
                                    <span className="inline-block px-3 py-1 bg-blue-50 text-[#40a9ff] text-[10px] font-black uppercase rounded-full mt-2 tracking-tighter">
                                        Patient ID: #{userData?._id?.slice(-5) || '0000'}
                                    </span>

                                    <div className="mt-8 space-y-4 text-left border-t border-gray-50 pt-8">
                                        <div className="flex items-center gap-4 group">
                                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-blue-50 transition-colors">
                                                <Mail className="w-4 h-4 text-[#40a9ff]" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">Email</p>
                                                <p className="text-sm font-medium text-gray-700">{userData?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 group">
                                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-red-50 transition-colors">
                                                <Phone className="w-4 h-4 text-[#f30004]" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">Emergency Contact</p>
                                                <p className="text-sm font-medium text-gray-700">{userData?.phone_number || userData?.phone || 'Not linked'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {!isEditing && (
                                        <button 
                                            onClick={() => setIsEditing(true)}
                                            className="w-full mt-8 flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-md shadow-gray-100"
                                        >
                                            <SquarePen className="w-4 h-4" /> Edit Information
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="bg-[#f30004]/5 border border-[#f30004]/10 rounded-2xl p-4 flex gap-3">
                                <ShieldCheck className="w-5 h-5 text-[#f30004] shrink-0" />
                                <p className="text-[11px] text-[#f30004] font-medium leading-relaxed">
                                    Your data is HIPAA compliant and stored securely. Only authorized medical staff can view your full history.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Content */}
                    <div className="lg:col-span-8">
                        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
                                        {isEditing ? "Modify Profile" : "Account Details"}
                                    </h3>
                                    <p className="text-gray-400 text-sm mt-1">Manage your personal and contact information</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                    <Database className="w-6 h-6 text-gray-300" />
                                </div>
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Username</label>
                                        <input 
                                            name="username"
                                            value={editFormData?.username || ''}
                                            onChange={handleEditChange}
                                            className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl focus:border-[#40a9ff] focus:ring-1 focus:ring-[#40a9ff] outline-none font-semibold text-gray-700 transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
                                        <input 
                                            name="email"
                                            type="email"
                                            value={editFormData?.email || ''}
                                            onChange={handleEditChange}
                                            className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl focus:border-[#40a9ff] focus:ring-1 focus:ring-[#40a9ff] outline-none font-semibold text-gray-700 transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone Number</label>
                                        <input 
                                            name="phone_number"
                                            value={editFormData?.phone_number || editFormData?.phone || ''}
                                            onChange={handleEditChange}
                                            className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl focus:border-[#40a9ff] focus:ring-1 focus:ring-[#40a9ff] outline-none font-semibold text-gray-700 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Patient Age</label>
                                        <input 
                                            name="age"
                                            type="number"
                                            value={editFormData?.age || ''}
                                            onChange={handleEditChange}
                                            className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl focus:border-[#40a9ff] focus:ring-1 focus:ring-[#40a9ff] outline-none font-semibold text-gray-700 transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2 flex gap-4 pt-6">
                                        <button 
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 bg-white border border-gray-200 text-gray-500 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-[2] bg-[#40a9ff] text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Update Profile
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 bg-gray-50 border border-gray-100 rounded-3xl">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Calendar className="w-4 h-4 text-[#40a9ff]" />
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Age Group</p>
                                            </div>
                                            <p className="text-2xl font-bold text-gray-800">{userData?.age || 'Not Set'} <span className="text-sm font-normal text-gray-400 italic">Years Old</span></p>
                                        </div>
                                        <div className="p-6 bg-gray-50 border border-gray-100 rounded-3xl">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Hash className="w-4 h-4 text-[#f30004]" />
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Biological Gender</p>
                                            </div>
                                            <p className="text-2xl font-bold text-gray-800">{userData?.gender || 'Unspecified'}</p>
                                        </div>
                                    </div>

                                    <div className="p-8 border-2 border-dashed border-gray-100 rounded-3xl">
                                        <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-[#40a9ff]" /> Medical Access Note
                                        </h4>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            Sensitive records like prescriptions, lab results, and diagnostic imaging are locked for viewing in the <span className="text-[#40a9ff] font-semibold">Records Tab</span>. To modify your birthdate or legal gender, please present valid identification at the hospital front desk.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#40a9ff]">
                                            <AlertCircle size={24} />
                                        </div>
                                        <div className="text-xs text-blue-800 font-medium">
                                            Last security check: <span className="font-bold">{new Date().toLocaleDateString()}</span>. 
                                            Keep your contact details updated for appointment reminders.
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;