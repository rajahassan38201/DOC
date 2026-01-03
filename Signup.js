import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, Phone, User, Calendar, Loader2, ArrowLeft } from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState(''); 
    const [gender, setGender] = useState('Male'); 
    const [age, setAge] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRayActive, setIsRayActive] = useState(false); 

    const [borderState, setBorderState] = useState('border-gray-200');

    useEffect(() => {
        const isUsernameFilled = username.length > 2;
        const isEmailFilled = email.length > 5 && email.includes('@');
        const isPasswordFilled = password.length > 5;
        const isPhoneFilled = phone.length >= 10;
        const isAgeFilled = parseInt(age, 10) > 0;

        if (isUsernameFilled && isEmailFilled && isPasswordFilled && isPhoneFilled && isAgeFilled) {
            setBorderState('border-red-500 shadow-[0_10px_40px_rgba(243,0,4,0.15)]');
        } else if (isUsernameFilled && isEmailFilled) {
            setBorderState('border-blue-400 shadow-[0_10px_30px_rgba(64,169,255,0.1)]');
        } else {
            setBorderState('border-gray-200 shadow-sm');
        }
    }, [username, email, password, phone, age]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!username || !email || !password || !gender || !age || !phone) {
            setError('Please fill out all required fields.');
            return;
        }

        setIsRayActive(true);
        setTimeout(() => setIsRayActive(false), 1500); 
        setIsLoading(true);

        try {
            const apiUrl = 'http://localhost:3001/api/auth/register-patient'; 
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, phone, gender, age }),
            });

            const data = await response.json();

            if (response.ok) {
                // Custom success message UI logic can go here
                setTimeout(() => navigate('/login'), 1000); 
            } else {
                setError(data.message || 'Registration failed. Please check details.');
                setIsLoading(false);
                setTimeout(() => setIsRayActive(false), 500); 
            }
        } catch (err) {
            setError('Network error. Ensure the backend is running.');
            setIsLoading(false);
            setTimeout(() => setIsRayActive(false), 500); 
        } 
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] py-12 px-4 relative overflow-hidden font-sans">
            
            {/* Background Blobs */}
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#40a9ff] rounded-full blur-[120px] opacity-10 pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#f30004] rounded-full blur-[120px] opacity-10 pointer-events-none" />

            {/* Signup Card */}
            <div className={`relative z-10 w-full max-w-xl bg-white rounded-[30px] border transition-all duration-500 overflow-hidden ${borderState}`}>
                
                {/* Header Gradient */}
                <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-r from-[#40a9ff] to-[#3691db] z-0" />

                {/* Ray Effect */}
                <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 overflow-hidden z-10 ${isRayActive ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-[#f30004]/5 to-transparent rotate-45 animate-[spin_3s_linear_infinite]" />
                </div>

                <div className="relative z-20 p-8 md:p-10 pt-10">
                    <button 
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm font-bold transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> BACK TO LOGIN
                    </button>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <UserPlus className="w-8 h-8" /> Create Account
                        </h2>
                        <p className="text-blue-50 text-[10px] mt-2 uppercase tracking-[0.25em] font-semibold opacity-90">
                            Aapka Digital Healthcare Journey Starts Here
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        {/* Full Name */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1 tracking-wider">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#40a9ff] transition-colors" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 focus:bg-white focus:border-[#40a9ff] focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1 tracking-wider">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#40a9ff] transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 focus:bg-white focus:border-[#40a9ff] focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                                    placeholder="you@shifa.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1 tracking-wider">Phone</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#40a9ff] transition-colors" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 focus:bg-white focus:border-[#40a9ff] focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                                    placeholder="03xxxxxxxxx"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1 tracking-wider">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#40a9ff] transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 focus:bg-white focus:border-[#40a9ff] focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                                    placeholder="Min. 6 chars"
                                    required
                                />
                            </div>
                        </div>

                        {/* Age & Gender Row */}
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 tracking-wider">Age</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#40a9ff] transition-colors" />
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 focus:bg-white focus:border-[#40a9ff] outline-none transition-all"
                                        placeholder="Age"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 tracking-wider">Gender</label>
                                <select 
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 focus:bg-white focus:border-[#40a9ff] outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {error && (
                            <div className="md:col-span-2 bg-red-50 border border-red-100 text-[#f30004] text-xs font-bold py-3 px-4 rounded-xl text-center">
                                {error}
                            </div>
                        )}

                        <div className="md:col-span-2 pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg 
                                    ${isLoading 
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                        : 'bg-[#f30004] hover:bg-red-700 text-white shadow-red-200 hover:scale-[1.01] active:scale-95'
                                    }`}
                            >
                                {isLoading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> CREATING ACCOUNT...</>
                                ) : 'Register Now'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <button 
                            onClick={() => navigate('/login')}
                            className="text-xs font-bold tracking-widest text-gray-400 hover:text-gray-600 transition-colors uppercase"
                        >
                            Already have an account? <span className="text-[#40a9ff] underline underline-offset-4 ml-1">Login here</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer Text */}
            <p className="absolute bottom-6 left-0 right-0 text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] pointer-events-none">
                Shifa Tameer-e-Millat University • Health Assistant
            </p>
        </div>
    );
};

export default Signup;