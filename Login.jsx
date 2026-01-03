import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Mail, Lock, Loader2 } from 'lucide-react';

const Login = ({ setToken, setUserRole }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRayActive, setIsRayActive] = useState(false);
    const [loginType, setLoginType] = useState('patient');

    // Dynamic border logic based on inputs (Red glow effect)
    const [borderState, setBorderState] = useState('border-white/10');
    
    useEffect(() => {
        const isEmailFilled = email.length > 5;
        const isPasswordFilled = password.length > 3;

        if (isEmailFilled && isPasswordFilled) {
            setBorderState('border-red-600 shadow-[0_0_30px_rgba(243,0,4,0.3)]');
        } else if (isEmailFilled) {
            setBorderState('border-t-red-600 border-r-red-600 border-l-white/10 border-b-white/10 shadow-[0_0_15px_rgba(64,169,255,0.2)]');
        } else {
            setBorderState('border-white/10');
        }
    }, [email, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsRayActive(true);
        setTimeout(() => setIsRayActive(false), 1500);
        setIsLoading(true);

        const endpoint = loginType === 'admin'
            ? 'http://localhost:3001/api/auth/admin-login'
            : 'http://localhost:3001/api/auth/patient-login';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.clear();
                if (setToken) setToken(data.token);
                localStorage.setItem('userToken', data.token);

                const role = loginType === 'admin' ? 'admin' : 'patient';
                if (setUserRole) setUserRole(role);
                localStorage.setItem('userRole', role);

                const redirectPath = role === 'admin' ? '/admin' : '/home';
                setTimeout(() => navigate(redirectPath), 500);
            } else {
                setError(data.message || 'Login failed. Invalid credentials.');
                setIsLoading(false);
                setTimeout(() => setIsRayActive(false), 500);
            }
        } catch (err) {
            setError('Network error. Could not reach the server.');
            setIsLoading(false);
            setTimeout(() => setIsRayActive(false), 500);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#020212] relative overflow-hidden font-sans">
            
            {/* 1. Background Blobs (From Homepage.css) */}
            <div className="absolute top-[10%] left-[-5%] w-[300px] h-[300px] bg-[#40a9ff] rounded-full blur-[80px] opacity-40 rotate-45" />
            <div className="absolute bottom-[5%] right-[-10%] w-[400px] h-[400px] bg-[#f30004] rounded-full blur-[80px] opacity-40 -rotate-30" />

            {/* 2. Main Login Card (Glassy Effect) */}
            <div className={`relative z-10 w-full max-w-md bg-white/5 backdrop-blur-[10px] rounded-[25px] border transition-all duration-500 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${borderState}`}>
                
                {/* 🌟 Top Primary Blue Strip (Design Solution) */}
                <div className="absolute top-0 left-0 right-0 h-[100px] bg-[#40a9ff] z-0 shadow-[0_5px_15px_rgba(0,0,0,0.4)]" />

                {/* Ray Effect Overlay */}
                <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 overflow-hidden z-10 ${isRayActive ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-[#f30004]/20 to-transparent rotate-45 animate-[spin_2s_linear_infinite]" />
                </div>

                <div className="relative z-20 p-8 pt-12">
                    {/* Icon Container with Glow */}
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            {loginType === 'admin' ? 
                                <ShieldCheck className="w-10 h-10 text-white" /> : 
                                <User className="w-10 h-10 text-white" />
                            }
                        </div>
                    </div>

                    {/* Title & Welcome Message (Light text on blue strip area) */}
                    <h2 className="text-3xl font-bold text-white text-center tracking-tight">
                        {loginType === 'admin' ? 'Staff Login' : 'Shifa Hospital'}
                    </h2>
                    <p className="text-white/80 text-center text-xs mt-2 mb-8 uppercase tracking-[0.2em] font-medium">
                        {loginType === 'admin' ? 'Administrative Access' : 'Aapka Digital Healthcare Companion'}
                    </p>

                    {/* Role Selector Tabs (Dark Blue background style) */}
                    <div className="flex p-1 bg-black/40 rounded-xl mb-8 border border-white/5">
                        <button 
                            onClick={() => setLoginType('patient')}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${loginType === 'patient' ? 'bg-[#40a9ff] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Patient
                        </button>
                        <button 
                            onClick={() => setLoginType('admin')}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${loginType === 'admin' ? 'bg-[#f30004] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Admin
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#c0c0c0] uppercase ml-1 tracking-wider">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#40a9ff] transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:border-[#40a9ff]/50 focus:ring-4 focus:ring-[#40a9ff]/10 outline-none transition-all"
                                    placeholder="you@shifa.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#c0c0c0] uppercase ml-1 tracking-wider">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#40a9ff] transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:border-[#40a9ff]/50 focus:ring-4 focus:ring-[#40a9ff]/10 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-[#f30004]/10 border border-[#f30004]/20 text-[#f30004] text-sm py-3 px-4 rounded-xl text-center">
                                {error}
                            </div>
                        )}

                        {/* CTA Button (Primary Red) */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-xl 
                                ${isLoading 
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                                    : 'bg-[#f30004] hover:bg-[#d40003] text-white shadow-[#f30004]/40 hover:scale-[1.02] active:scale-95'
                                }`}
                        >
                            {isLoading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> ACCESSING...</>
                            ) : 'Login'}
                        </button>
                    </form>

                    {/* Links area matching Homepage nav style */}
                    <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3 items-center text-xs font-medium tracking-widest text-[#c0c0c0]">
                        {loginType === 'patient' ? (
                            <>
                                <button onClick={() => navigate('/signup')} className="hover:text-[#40a9ff] transition-colors underline decoration-[#40a9ff]/30 underline-offset-4">New User? Create Account</button>
                                <button onClick={() => navigate('/forgot-password')} className="hover:text-white transition-colors">Forgot Password?</button>
                            </>
                        ) : (
                            <span className="text-gray-600">Authorized Personnel Only</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;