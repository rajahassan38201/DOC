import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Link add kiya hai
import { Activity, Heart, Microscope, Users, ShieldCheck, ChevronLeft } from 'lucide-react';

const AboutUs = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="relative min-h-screen w-full bg-[#f8fafc] overflow-x-hidden font-sans selection:bg-blue-100">
            
            {/* 1. Background Glassy Blobs */}
            <div className="absolute top-[-5%] -right-[5%] w-[400px] h-[400px] bg-[#40a9ff] rounded-full blur-[120px] opacity-10 pointer-events-none animate-pulse" />
            <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] bg-[#f30004] rounded-full blur-[120px] opacity-10 pointer-events-none" />

            {/* 2. Main Container Wrapper */}
            <div className="relative z-10 m-2 md:m-6 p-4 md:p-8 bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white overflow-hidden min-h-screen">
                
                {/* Blue Top Strip Header */}
                <div className="absolute top-0 left-0 right-0 h-[180px] bg-gradient-to-r from-[#40a9ff] to-[#3691db] z-0" />

                {/* --- NEW BRANDING NAVBAR SECTION --- */}
                <div className="relative z-30 flex justify-between items-center px-4 md:px-6 h-[80px] mb-8">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center -rotate-6 group-hover:rotate-0 transition-all duration-500 overflow-hidden">
                            <Activity className="text-[#40a9ff] w-8 h-8" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-white text-2xl md:text-3xl font-black tracking-tighter uppercase">SHIFA</span>
                            <span className="text-[#f30004] text-[10px] md:text-[12px] font-bold tracking-[0.2em] mt-1 ml-0.5 uppercase">Hospital</span>
                        </div>
                    </Link>
                    
                    {/* Back to Home Button */}
                    <Link to="/" className="text-white/80 hover:text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2 transition-all">
                        <ChevronLeft className="w-4 h-4" /> Home
                    </Link>
                </div>

                {/* Hero Content */}
                <header className="relative z-20 pb-16 text-center text-[#f30004]">
                    <motion.h1 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-4xl md:text-6xl font-black tracking-tighter"
                    >
                        OUR <span className="text-[#f30004]">LEGACY</span> OF <span className="text-[#f30004]">CARE.</span>
                    </motion.h1>
                    <motion.p className="mt-4 text-blue-50 font-medium max-w-xl mx-auto opacity-90">
                        Shifa Tameer-e-Millat University's vision for a healthier tomorrow, powered by compassion and next-gen technology.
                    </motion.p>
                </header>

                {/* Stats Grid (Floating Cards) */}
                <div className="relative z-20 grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 -mt-8">
                    <StatCard number="25+" label="Years of Trust" color="#40a9ff" delay={0.1} />
                    <StatCard number="50+" label="Expert Doctors" color="#f30004" delay={0.2} />
                    <StatCard number="10k+" label="Happy Patients" color="#0d1a26" delay={0.3} />
                    <StatCard number="24/7" label="Emergency" color="#40a9ff" delay={0.4} />
                </div>

                {/* Who We Are Section */}
                <section className="mt-24 px-4 md:px-12 grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="relative group"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-r from-[#40a9ff] to-[#f30004] opacity-10 rounded-[40px] blur-2xl group-hover:opacity-20 transition-all" />
                        <img 
                            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80" 
                            className="relative rounded-[32px] shadow-2xl border-4 border-white object-cover h-[400px] w-full"
                            alt="Hospital building"
                        />
                    </motion.div>

                    <div className="space-y-6">
                        <h2 className="text-4xl font-black text-gray-900 leading-tight tracking-tight uppercase italic">
                            Who We <span className="text-[#40a9ff]">Are</span>
                        </h2>
                        <div className="w-20 h-1.5 bg-[#f30004] rounded-full" />
                        <p className="text-lg text-gray-500 font-medium leading-relaxed">
                            Founded with a mission to serve, Shifa Hospital stands as a beacon of hope. Humara institution sirf ilaj nahi karta, balkay insaniyat ki khidmat mein modern science ko shamil karta hai.
                        </p>
                        
                        <div className="space-y-4">
                            <VisionItem icon={<ShieldCheck color="#40a9ff"/>} title="Our Mission" text="Quality healthcare accessible to everyone." />
                            <VisionItem icon={<Heart color="#f30004"/>} title="Our Vision" text="To lead medical innovation in Pakistan." />
                        </div>
                    </div>
                </section>

                {/* Core Values */}
                <section className="mt-32 pb-20">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Core <span className="text-[#40a9ff]">Values</span></h3>
                        <div className="w-16 h-1 bg-[#f30004] mx-auto mt-2" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 px-4">
                        <ValueCard icon={<Heart className="text-[#f30004]"/>} title="Patient First" desc="Har faisla mareez ki behtari ke liye." />
                        <ValueCard icon={<Microscope className="text-[#40a9ff]"/>} title="Innovation" desc="Latest AI aur medical technology ka istemal." />
                        <ValueCard icon={<Users className="text-[#0d1a26]"/>} title="Trust" desc="Transparency hamari bunyad hai." />
                    </div>
                </section>

                {/* CTA Footer Wrapper */}
                <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="mt-10 bg-[#0d1a26] rounded-[40px] p-10 md:p-16 text-center text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#f30004] blur-[120px] opacity-20" />
                    <h2 className="text-3xl md:text-5xl font-black mb-6 italic tracking-tighter uppercase">NEED ASSISTANCE?</h2>
                    <p className="text-gray-400 mb-8 font-medium">Hamari team 24/7 aapki madad ke liye tayyar hai.</p>
                    <button className="px-10 py-4 bg-[#40a9ff] hover:bg-[#3292e0] rounded-2xl font-black tracking-widest transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                        CALL SUPPORT: 051-8463000
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

// Sub-components
const StatCard = ({ number, label, color, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-white p-6 rounded-[24px] shadow-xl border border-gray-50 text-center"
    >
        <h3 className="text-3xl font-black mb-1 italic tracking-tighter" style={{ color }}>{number}</h3>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
    </motion.div>
);

const VisionItem = ({ icon, title, text }) => (
    <div className="flex gap-4 p-4 rounded-2xl hover:bg-white transition-all border border-transparent hover:border-gray-100 shadow-sm hover:shadow-md group">
        <div className="mt-1 transform group-hover:scale-110 transition-transform">{icon}</div>
        <div>
            <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight italic">{title}</h4>
            <p className="text-sm text-gray-500 font-medium">{text}</p>
        </div>
    </div>
);

const ValueCard = ({ icon, title, desc }) => (
    <motion.div 
        whileHover={{ y: -10 }}
        className="bg-white/50 backdrop-blur-md p-10 rounded-[32px] border border-white shadow-sm hover:shadow-2xl transition-all group text-center"
    >
        <div className="mb-6 flex justify-center transform group-hover:rotate-12 transition-transform">{icon}</div>
        <h4 className="text-xl font-black text-gray-900 mb-3 uppercase italic tracking-tighter">{title}</h4>
        <p className="text-gray-500 font-medium text-sm leading-relaxed">{desc}</p>
    </motion.div>
);

export default AboutUs;