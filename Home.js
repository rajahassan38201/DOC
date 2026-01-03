import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import { User, Calendar, MessageSquare, LogOut, LogIn, Menu, X, ChevronRight, Activity, Users } from 'lucide-react';

const Home = ({ onLogout, token }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const isAuthenticated = !!token;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const handleCloseMenu = () => setIsMenuOpen(false);
    
    const handleLogoutClick = () => {
        handleCloseMenu();
        if (onLogout) onLogout();
    };

    return (
        <div className="relative min-h-screen w-full bg-[#f8fafc] overflow-x-hidden font-sans selection:bg-blue-100">
            
            {/* 1. Background Glassy Blobs */}
            <div className="absolute top-[-10%] -left-[5%] w-[500px] h-[500px] bg-[#40a9ff] rounded-full blur-[120px] opacity-10 pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-10%] -right-[10%] w-[600px] h-[600px] bg-[#f30004] rounded-full blur-[120px] opacity-10 pointer-events-none" />

            {/* 2. Main Content Wrapper */}
            <div className="relative z-10 m-2 md:m-6 p-4 md:p-6 bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white overflow-hidden min-h-[calc(100vh-3rem)]">
                
                {/* Navbar Area Top Strip */}
                <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-r from-[#40a9ff] to-[#3691db] z-0" />

                <header className="relative z-30 flex justify-between items-center px-4 md:px-10 h-[100px]">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center -rotate-6 group-hover:rotate-0 transition-all duration-500 overflow-hidden">
                             <Activity className="text-[#40a9ff] w-8 h-8" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-white text-2xl md:text-3xl font-black tracking-tighter">SHIFA</span>
                            <span className="text-[#f30004] text-[10px] md:text-[12px] font-bold tracking-[0.2em] mt-1 ml-0.5 uppercase">Hospital</span>
                        </div>
                    </Link>

                    {/* Navigation Links (Desktop) */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {['Home', 'Features'].map((item) => (
                            <a 
                                key={item}
                                href={`#${item.toLowerCase()}`} 
                                className="text-white/90 hover:text-white transition-all font-bold text-sm uppercase tracking-widest py-1 border-b-2 border-transparent hover:border-white/40"
                            >
                                {item}
                            </a>
                        ))}
                        {/* About Link updated to Route */}
    <Link 
        to="/aboutus" 
        className="text-white/90 hover:text-white transition-all font-bold text-sm uppercase tracking-widest py-1 border-b-2 border-transparent hover:border-white/40"
    >
        About
    </Link>
                        <div className="h-8 w-[1px] bg-white/20 mx-2" />

                        <div className="relative group">
                            <button 
                                onClick={toggleMenu} 
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all outline-none ${isMenuOpen ? 'bg-white text-[#40a9ff]' : 'text-white hover:bg-white/10'}`}
                            >
                                <span className="font-bold text-sm tracking-wider uppercase">Menu</span>
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>

                            {isMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={handleCloseMenu} />
                                    <div className="absolute right-0 mt-4 w-64 bg-white rounded-[24px] shadow-[0_20px_70px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                                        <div className="p-3 space-y-1">
                                            <MenuLink to="/profile" icon={<User className="w-4 h-4"/>} label="Patient Profile" onClick={handleCloseMenu} />
                                            <MenuLink to="/appointments" icon={<Calendar className="w-4 h-4"/>} label="My Appointments" onClick={handleCloseMenu} />
                                            <MenuLink to="/chatbot" icon={<MessageSquare className="w-4 h-4"/>} label="AI Health Assistant" onClick={handleCloseMenu} />
                                            
                                            <div className="my-2 border-t border-gray-50" />

                                            {isAuthenticated ? (
                                                <button 
                                                    onClick={handleLogoutClick} 
                                                    className="w-full flex items-center justify-between px-4 py-4 text-[#f30004] font-bold text-sm hover:bg-red-50 rounded-2xl transition-all"
                                                >
                                                    <span className="flex items-center gap-3"><LogOut className="w-4 h-4" /> Logout</span>
                                                    <ChevronRight className="w-4 h-4 opacity-50" />
                                                </button>
                                            ) : (
                                                <Link 
                                                    to="/login" 
                                                    className="flex items-center justify-between px-4 py-4 text-[#40a9ff] font-bold text-sm hover:bg-blue-50 rounded-2xl transition-all"
                                                    onClick={handleCloseMenu}
                                                >
                                                    <span className="flex items-center gap-3"><LogIn className="w-4 h-4" /> Sign In</span>
                                                    <ChevronRight className="w-4 h-4 opacity-50" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </nav>

                    <button className="lg:hidden p-2 bg-white/20 rounded-xl text-white">
                        <Menu className="w-7 h-7" />
                    </button>
                </header>

                {/* 3. Hero Section */}
                <section className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20 pt-16 lg:pt-24 pb-12 gap-12">
                    <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <span className="text-[10px] font-black text-[#40a9ff] uppercase tracking-[0.2em]">Next-Gen Health Tech</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
                            Smart Care <br />
                            <span className="text-[#40a9ff]">Seamless</span> <span className="text-[#f30004]">Life.</span>
                        </h1>
                        
                        <p className="text-lg text-gray-500 font-medium leading-relaxed">
                            Shifa Tameer-e-Millat University presents an AI-driven ecosystem designed to connect patients and doctors instantly.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                            {/* VIEW DOCTORS BUTTON WITH ROUTE */}
                            <Link 
                                to="/doctors" 
                                className="w-full sm:w-auto px-10 py-5 bg-[#40a9ff] text-white rounded-[20px] text-lg font-bold shadow-[0_20px_40px_rgba(64,169,255,0.3)] hover:bg-[#3292e0] hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                            >
                                <Users className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
                                View Doctors
                            </Link>

                            <Link 
                                to="/chatbot" 
                                className="w-full sm:w-auto px-10 py-5 bg-[#f30004] text-white rounded-[20px] text-lg font-bold shadow-[0_20px_40px_rgba(243,0,4,0.3)] hover:bg-red-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                                <MessageSquare className="w-6 h-6" /> AI Chatbot
                            </Link>
                        </div>
                    </div>

                    <div className="flex-1 relative w-full max-w-[500px] aspect-square lg:aspect-video bg-gradient-to-br from-gray-50 to-white rounded-[40px] shadow-inner border border-gray-100 flex items-center justify-center overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
                        <Activity className="w-32 h-32 text-[#40a9ff]/20 group-hover:scale-125 transition-transform duration-700" />
                        <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">98%</div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">System Accuracy</p>
                                    <p className="text-xs text-gray-500 font-medium">Verified AI Diagnostics & Help</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="relative z-10 py-20 px-6 lg:px-20" id="features">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Key System <span className="text-[#40a9ff]">Features</span></h3>
                        <div className="w-20 h-1.5 bg-[#f30004] mx-auto mt-4 rounded-full" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard 
                            title="For Patients" 
                            color="#40a9ff"
                            items={["Book Appointments", "AI Medical Info", "Digital Reports"]} 
                        />
                        <FeatureCard 
                            title="For Doctors" 
                            color="#f30004"
                            items={["Manage Schedules", "Real-time Alerts", "Patient History"]} 
                        />
                        <FeatureCard 
                            title="For Admin" 
                            color="#0d1a26"
                            items={["Data Analytics", "3D Hospital Maps", "User Control"]} 
                        />
                    </div>
                </section>

                <footer className="relative z-10 bg-[#0d1a26] text-white p-12 rounded-[40px] mt-10" id="contact">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-center md:text-left">
                            <h4 className="text-2xl font-black italic tracking-tighter">SHIFA <span className="text-[#f30004]">HOSPITAL</span></h4>
                            <p className="text-gray-400 text-sm mt-2 font-medium">Tameer-e-Millat University Visionary Project</p>
                        </div>
                        <div className="flex gap-6">
                            <div className="text-center md:text-right">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Emergency Help</p>
                                <p className="text-xl font-black text-[#40a9ff]">Ext 100 • 051-8463000</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

const MenuLink = ({ to, icon, label, onClick }) => (
    <Link 
        to={to} 
        onClick={onClick}
        className="flex items-center justify-between px-4 py-4 text-gray-600 font-bold text-sm hover:bg-gray-50 rounded-2xl transition-all group"
    >
        <span className="flex items-center gap-3">
            <span className="text-gray-400 group-hover:text-[#40a9ff] transition-colors">{icon}</span>
            {label}
        </span>
        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#40a9ff]" />
    </Link>
);

const FeatureCard = ({ title, items, color }) => (
    <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all group relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full transition-all group-hover:w-full group-hover:opacity-[0.02]" style={{ backgroundColor: color }} />
        <h4 className="text-2xl font-black mb-6 flex items-center gap-3 uppercase tracking-tighter italic transition-colors" style={{ color: color }}>
            {title}
        </h4>
        <ul className="space-y-4">
            {items.map((item, j) => (
                <li key={j} className="flex items-center gap-3 text-gray-500 font-bold text-sm uppercase tracking-wide">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                    {item}
                </li>
            ))}
        </ul>
    </div>
);

export default Home;