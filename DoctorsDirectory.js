import React, { useState, useEffect } from 'react';
import { 
  User, 
  Star, 
  Clock, 
  Stethoscope, 
  Search, 
  Award, 
  Phone,
  Filter,
  ArrowRight,
  ShieldCheck,
  Activity,
  X,
  FileText,
  Calendar,
  ChevronRight
} from 'lucide-react';

const DoctorsDirectory = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState(null); // For Detail Modal
  const [error, setError] = useState(null);

  // FETCH DATA FROM YOUR DB
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        // Pointing to your server.js port 3001
        const response = await fetch('http://localhost:3001/api/doctors');
        if (!response.ok) throw new Error("Failed to fetch medical staff");
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        setError(err.message);
        console.error("DB Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const calculateRating = (reviews) => {
    if (!reviews || reviews.length === 0) return "5.0"; // Default for new doctors
    const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const filteredDoctors = doctors.filter(doc => {
    const fullName = `${doc.first_name} ${doc.last_name}`.toLowerCase();
    const role = (doc.role || "").toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                          role.includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === "All" || doc.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  const roles = ["All", ...new Set(doctors.map(d => d.role).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 font-sans">
      
      {/* --- PREMIUM HEADER SECTION --- */}
      <div className="relative bg-white border-b border-gray-100 pt-16 pb-12 px-6 overflow-hidden">
        {/* Soft Background Blobs (Matching Login Theme) */}
        <div className="absolute top-[-10%] left-[-5%] w-[300px] h-[300px] bg-[#40a9ff] rounded-full blur-[100px] opacity-10 pointer-events-none" />
        <div className="absolute bottom-[0%] right-[-5%] w-[300px] h-[300px] bg-[#f30004] rounded-full blur-[100px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
                <span className="w-2 h-2 rounded-full bg-[#40a9ff] animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#40a9ff]">Certified Faculty</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                Our Expert <span className="text-[#f30004]">Specialists</span>
              </h1>
              <p className="text-gray-500 font-medium max-w-xl text-lg">
                Explore our directory of highly qualified medical professionals dedicated to your well-being.
              </p>
            </div>
            
            {/* Search & Filter Group */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative group flex-1 sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#40a9ff] transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Search by name or specialty..." 
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-[20px] focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-[#40a9ff] outline-none transition-all font-semibold shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative sm:w-48">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                <select 
                  className="w-full pl-12 pr-8 py-4 bg-gray-50 border border-gray-200 rounded-[20px] appearance-none focus:bg-white focus:border-[#40a9ff] outline-none font-bold text-gray-700 shadow-sm cursor-pointer"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  {roles.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- DOCTORS GRID --- */}
      <div className="max-w-7xl mx-auto py-16 px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="relative">
                <Activity className="w-16 h-16 text-[#40a9ff] animate-pulse" />
                <div className="absolute inset-0 w-16 h-16 border-4 border-blue-100 border-t-[#f30004] rounded-full animate-spin"></div>
            </div>
            <p className="font-black text-gray-400 tracking-[0.2em] uppercase text-xs">Accessing Database...</p>
          </div>
        ) : error ? (
            <div className="text-center py-20 bg-red-50 rounded-[40px] border border-red-100">
                <p className="text-[#f30004] font-bold">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 underline text-sm font-bold">Try Again</button>
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredDoctors.map((doc) => (
              <div 
                key={doc._id} 
                className="group relative bg-white border border-gray-100 rounded-[40px] p-8 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col"
              >
                {/* Status Indicator */}
                <div className="absolute top-8 right-8 flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span className="text-[10px] font-black text-green-600 uppercase">Available</span>
                </div>

                {/* Avatar & Basic Info */}
                <div className="flex items-start gap-6 mb-8">
                  <div className="relative shrink-0">
                    <div className="w-24 h-24 bg-gray-50 rounded-[28px] border border-gray-100 flex items-center justify-center overflow-hidden group-hover:bg-blue-50 transition-colors">
                        <User className="w-12 h-12 text-gray-300 group-hover:text-[#40a9ff] transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-md border border-gray-50">
                        <ShieldCheck className="w-5 h-5 text-[#40a9ff]" />
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center gap-1 text-yellow-500 mb-1">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-sm font-black text-gray-900">{calculateRating(doc.reviews)}</span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 leading-tight">
                        {doc.title || "Dr."} {doc.first_name} {doc.last_name}
                    </h3>
                    <p className="text-[#40a9ff] font-bold text-sm mt-1">{doc.role}</p>
                  </div>
                </div>

                {/* Tags Section */}
                <div className="space-y-3 mb-8">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Treats Symptoms</p>
                    <div className="flex flex-wrap gap-2">
                        {doc.symptoms?.slice(0, 3).map((symp, i) => (
                            <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold border border-gray-100 uppercase tracking-tight">
                                {symp}
                            </span>
                        ))}
                        {doc.symptoms?.length > 3 && (
                            <span className="px-3 py-1.5 bg-blue-50 text-[#40a9ff] rounded-xl text-xs font-bold border border-blue-50">
                                +{doc.symptoms.length - 3}
                            </span>
                        )}
                    </div>
                </div>

                {/* Footer Interaction */}
                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Extension</span>
                        <span className="text-sm font-bold text-gray-700">{doc.contact || 'N/A'}</span>
                    </div>
                    <button 
                        onClick={() => setSelectedDoctor(doc)}
                        className="bg-gray-900 text-white p-4 rounded-2xl hover:bg-[#f30004] transition-all hover:translate-x-1 shadow-lg shadow-gray-200"
                    >
                        <ArrowRight size={20} />
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- DOCTOR DETAIL MODAL --- */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div 
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
                onClick={() => setSelectedDoctor(null)}
            />
            
            <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header Strip */}
                <div className="h-32 bg-gradient-to-r from-[#40a9ff] to-[#3691db] flex items-end px-10 pb-4">
                    <button 
                        onClick={() => setSelectedDoctor(null)}
                        className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-all"
                    >
                        <X size={20} />
                    </button>
                    <div className="w-24 h-24 bg-white rounded-[30px] border-4 border-white shadow-xl flex items-center justify-center translate-y-12">
                         <User className="w-12 h-12 text-[#40a9ff]" />
                    </div>
                </div>

                <div className="pt-16 px-10 pb-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900">
                                {selectedDoctor.title || "Dr."} {selectedDoctor.first_name} {selectedDoctor.last_name}
                            </h2>
                            <p className="text-[#40a9ff] font-bold text-lg flex items-center gap-2">
                                <Stethoscope size={18} /> {selectedDoctor.role}
                            </p>
                        </div>
                        <div className="text-right">
                             <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-black text-yellow-700">{calculateRating(selectedDoctor.reviews)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
                        <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100 text-center">
                            <Award className="w-5 h-5 text-[#f30004] mx-auto mb-2" />
                            <p className="text-[10px] font-black text-gray-400 uppercase">Experience</p>
                            <p className="text-sm font-bold text-gray-800">10+ Years</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100 text-center">
                            <Clock className="w-5 h-5 text-[#40a9ff] mx-auto mb-2" />
                            <p className="text-[10px] font-black text-gray-400 uppercase">Availability</p>
                            <p className="text-sm font-bold text-gray-800">
                                {selectedDoctor.weekly_schedule_template?.[0]?.day_of_week || 'Mon-Fri'}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100 text-center col-span-2 sm:col-span-1">
                            <FileText className="w-5 h-5 text-green-500 mx-auto mb-2" />
                            <p className="text-[10px] font-black text-gray-400 uppercase">License</p>
                            <p className="text-sm font-bold text-gray-800 truncate">{selectedDoctor.medical_license_number || 'Verified'}</p>
                        </div>
                    </div>

                    {/* Detail Tabs Content (Simple list for now) */}
                    <div className="mt-8 space-y-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        <div>
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Calendar size={14} className="text-[#f30004]" /> Weekly Template
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedDoctor.weekly_schedule_template?.map((slot, i) => (
                                    <div key={i} className="px-4 py-2 bg-white border border-gray-200 rounded-2xl flex items-center gap-3 text-sm font-bold">
                                        <span className="text-[#40a9ff]">{slot.day_of_week}</span>
                                        <span className="text-gray-400">|</span>
                                        <span>{slot.start_time} - {slot.end_time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {selectedDoctor.achievements?.length > 0 && (
                            <div>
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Achievements & Awards</h4>
                                <ul className="space-y-2">
                                    {selectedDoctor.achievements.map((ach, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700 bg-gray-50 p-3 rounded-2xl">
                                            <Award size={16} className="text-yellow-500" /> {ach.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="mt-10 flex gap-4">
                        <button className="flex-1 bg-[#40a9ff] hover:bg-blue-600 text-white py-5 rounded-[24px] font-black text-sm tracking-widest transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2">
                            BOOK APPOINTMENT <ChevronRight size={18} />
                        </button>
                        <button className="w-16 h-16 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-[24px] flex items-center justify-center transition-all">
                            <Phone size={22} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- FOOTER CTA --- */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-gray-900 rounded-[50px] p-12 text-center relative overflow-hidden">
             <div className="relative z-10">
                <h2 className="text-3xl font-black text-white mb-4">Shifa <span className="text-[#f30004]">Digital</span> Health</h2>
                <p className="text-gray-400 font-medium max-w-md mx-auto mb-8">Access our complete medical directory and book appointments with ease through our smart scheduling system.</p>
                <div className="flex flex-wrap justify-center gap-4">
                    <div className="flex items-center gap-2 text-white/60 text-xs font-black uppercase tracking-widest">
                        <ShieldCheck className="text-green-500" size={16} /> Data Secured
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-xs font-black uppercase tracking-widest">
                        <Activity className="text-[#40a9ff]" size={16} /> 24/7 Monitoring
                    </div>
                </div>
             </div>
             {/* Background glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#f30004] rounded-full blur-[120px] opacity-20" />
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default DoctorsDirectory;