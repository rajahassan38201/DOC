import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Users, 
  Calendar, 
  LogOut, 
  Clock, 
  Search, 
  X, 
  LayoutDashboard, 
  Activity, 
  ChevronRight,
  User,
  Stethoscope
} from 'lucide-react';

const AdminPage = ({ token, onLogout }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Rescheduling States
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [rescheduleDate, setRescheduleDate] = useState("");

    const fetchAppointments = useCallback(async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/admin/appointments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Data load error", err);
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleDateChange = async (date, doctorId) => {
        setRescheduleDate(date);
        if (!date || !doctorId) return;

        setLoadingSlots(true);
        setAvailableSlots([]);
        try {
            const res = await axios.get(`http://localhost:3001/api/appointments/availability/${doctorId}/${date}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAvailableSlots(res.data.slots || []);
        } catch (err) {
            console.error("Slots fetch error", err);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleRescheduleSubmit = async (appId, slot) => {
        try {
            const res = await axios.patch(`http://localhost:3001/api/admin/update-slot/${appId}`, {
                newStartTime: slot.start_time_ts,
                newEndTime: slot.end_time_ts,
                availabilitySlotRef: slot.availabilitySlotRef,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setSelectedAppointment(null);
                setAvailableSlots([]);
                fetchAppointments();
            }
        } catch (err) {
            // alert functionality restricted in iframe environment, using console or silent fail
            console.error(err.response?.data?.error || "Update failed");
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F4F8] text-slate-800 font-sans relative overflow-x-hidden">
            {/* Background Blobs */}
            <div className="fixed -top-24 -right-24 w-96 h-96 bg-[#007bff]/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-[#ff3b3f]/10 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Sidebar Overlay for Mobile could be here, but using a clean Desktop Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-64 bg-white/80 backdrop-blur-md border-r border-white/40 z-50 hidden lg:flex flex-col shadow-xl">
                <div className="p-8">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-[#007bff] rounded-lg">
                            <Activity className="text-white w-5 h-5" />
                        </div>
                        <h1 className="text-xl font-black tracking-tight text-[#003366]">Shifa<span className="text-[#ff3b3f]">Hospital</span></h1>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#007bff]/10 text-[#007bff] rounded-xl font-bold transition-all">
                        <LayoutDashboard size={20} /> Dashboard
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-white rounded-xl font-semibold transition-all">
                        <Calendar size={20} /> Appointments
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-white rounded-xl font-semibold transition-all">
                        <Users size={20} /> Patients
                    </button>
                </nav>

                <div className="p-6 border-t border-slate-100">
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-[#ff3b3f] hover:bg-red-50 rounded-xl font-bold transition-all">
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="lg:pl-64 min-h-screen">
                {/* Navbar */}
                <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-lg border-b border-white/40 px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-full max-w-xs group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#007bff]" size={18} />
                            <input type="text" placeholder="Search patient..." className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#007bff]/20 outline-none transition-all" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-slate-900 leading-none">Admin Panel</p>
                            <p className="text-[10px] text-slate-400 font-medium">System Manager</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#003366] to-[#007bff] border-2 border-white shadow-md"></div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {/* Header Intro */}
                    <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h2 className="text-3xl font-black text-[#003366]">Manage Your <span className="text-[#ff3b3f]">Patient</span> Flow</h2>
                            <p className="text-slate-500 mt-2 font-medium">Aapna patients ni details ane appointment slots manage karo.</p>
                        </div>
                        <div className="bg-[#007bff] p-6 rounded-[2rem] text-white shadow-2xl shadow-[#007bff]/30 flex items-center gap-6 min-w-[240px]">
                            <div>
                                <p className="text-[#007bff]/20 bg-white rounded-full px-2 py-0.5 text-[10px] font-black uppercase w-fit mb-2">Total</p>
                                <h3 className="text-4xl font-black">{appointments.length}</h3>
                                <p className="text-xs opacity-80 mt-1 font-medium">↑ 12% from yesterday</p>
                            </div>
                            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                                <Calendar className="w-8 h-8" />
                            </div>
                        </div>
                    </div>

                    {/* Appointments Table Card */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white/50 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/30">
                            <h3 className="text-lg font-black text-[#003366]">Recent Activity</h3>
                            <button className="text-[#007bff] text-xs font-bold flex items-center gap-1 hover:underline">View All <ChevronRight size={14} /></button>
                        </div>

                        {loading ? (
                            <div className="p-20 text-center flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-[#007bff]/20 border-t-[#007bff] rounded-full animate-spin"></div>
                                <p className="text-slate-400 font-bold animate-pulse">Loading appointments...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full border-separate border-spacing-0">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-8 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Patient Details</th>
                                            <th className="px-8 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Consultant</th>
                                            <th className="px-8 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Schedule</th>
                                            <th className="px-8 py-4 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {appointments.map((app) => {
                                            const patientName = app.patient_id?.username || app.patient_name || "Unknown Patient";
                                            const doctorName = app.doctor_id?.first_name 
                                                ? `Dr. ${app.doctor_id.first_name} ${app.doctor_id.last_name || ""}` 
                                                : "Dr. Specialist";
                                            const doctorId = app.doctor_id?._id || app.doctor_id;
                                            const appDate = new Date(app.start_time_ts);

                                            return (
                                                <tr key={app._id} className="group hover:bg-[#007bff]/[0.02] transition-colors">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#003366] font-black group-hover:bg-[#007bff] group-hover:text-white transition-all">
                                                                {patientName.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900 leading-none">{patientName}</p>
                                                                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">ID: {typeof (app.patient_id?._id || app.patient_id) === 'string' ? (app.patient_id?._id || app.patient_id).slice(-8).toUpperCase() : "UID"}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2">
                                                            <Stethoscope size={16} className="text-[#007bff]" />
                                                            <span className="text-sm font-semibold text-slate-700">{doctorName}</span>
                                                        </div>
                                                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-black rounded-md uppercase">Confirmed</span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-slate-800">
                                                                {appDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                            </span>
                                                            <div className="flex items-center gap-1 text-slate-400 mt-1">
                                                                <Clock size={12} />
                                                                <span className="text-xs font-medium">{appDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-center relative">
                                                        <button 
                                                            onClick={() => setSelectedAppointment(app._id)}
                                                            className="bg-[#ff3b3f] text-white text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-red-200 active:scale-95 transition-all"
                                                        >
                                                            Reschedule
                                                        </button>

                                                        {/* Popover Card */}
                                                        {selectedAppointment === app._id && (
                                                            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 z-50 animate-in fade-in zoom-in-95 text-left">
                                                                <div className="flex justify-between items-center mb-4">
                                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select New Slot</p>
                                                                    <button onClick={() => setSelectedAppointment(null)} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><X size={14} /></button>
                                                                </div>
                                                                <input 
                                                                    type="date" 
                                                                    min={new Date().toISOString().split("T")[0]}
                                                                    className="w-full bg-slate-50 border-none rounded-xl px-3 py-2 text-sm font-bold mb-3 focus:ring-2 focus:ring-[#007bff]/20 outline-none"
                                                                    onChange={(e) => handleDateChange(e.target.value, doctorId)}
                                                                />
                                                                
                                                                {loadingSlots && (
                                                                    <div className="py-4 text-center">
                                                                        <div className="w-4 h-4 border-2 border-[#007bff]/20 border-t-[#007bff] rounded-full animate-spin mx-auto"></div>
                                                                    </div>
                                                                )}

                                                                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                                                                    {availableSlots.length > 0 ? availableSlots.map((slot, idx) => (
                                                                        <button 
                                                                            key={idx} 
                                                                            onClick={() => handleRescheduleSubmit(app._id, slot)}
                                                                            className="py-2 px-1 text-[10px] font-black bg-slate-50 hover:bg-[#007bff] hover:text-white rounded-lg transition-all border border-slate-100"
                                                                        >
                                                                            {slot.display_time}
                                                                        </button>
                                                                    )) : !loadingSlots && rescheduleDate && (
                                                                        <p className="col-span-2 text-center text-[10px] text-slate-400 font-bold py-2 uppercase">No slots available</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {appointments.length === 0 && !loading && (
                                    <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">
                                        No appointments found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <footer className="mt-auto py-10 text-center">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Aapnu Swasthya, Amari Prathamikta.</p>
                    <p className="text-slate-300 text-[10px] mt-1">© 2025 HEALTHPRO ADMIN • PREMIUM DASHBOARD V2</p>
                </footer>
            </main>
        </div>
    );
};

export default AdminPage;