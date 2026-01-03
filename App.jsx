import React, { useState, useEffect } from 'react';
import { 
    BrowserRouter as Router, 
    Route, 
    Routes, 
    Navigate 
} from 'react-router-dom'; 

import Login from './Login';
import Home from './Home';      
import Chatbot from './Chatbot'; 
import Signup from './Signup';
import Profile from './Profile'; 
import Appointments from './AppointmentBooking';
import AdminPage from './AdminPage';
import DoctorsDirectory from './DoctorsDirectory'; // ✅ Imported your Doctors Directory
import './index.css';
import './App.css';
import AboutUs from './AboutUs';

// ==================================================================
// Protected Route Component
// ==================================================================
const ProtectedRoute = ({ token, children }) => {
    const isAuthenticated = !!token; 
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
};
// ==================================================================

function App() {
    const [token, setToken] = useState(() => localStorage.getItem('userToken') || null);

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('userToken');
        window.location.href = '/login'; 
    };

    useEffect(() => {
        if (token) localStorage.setItem('userToken', token);
        else localStorage.removeItem('userToken');
    }, [token]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route path="/signup" element={<Signup />} />

                {/* Home (Patient) */}
                <Route 
                    path="/home" 
                    element={
                        <ProtectedRoute token={token}>
                            <Home token={token} onLogout={handleLogout} />
                        </ProtectedRoute>
                    } 
                />

                {/* ✅ Doctors Directory Route */}
                <Route 
                    path="/doctors" 
                    element={
                        <ProtectedRoute token={token}>
                            <DoctorsDirectory token={token} onLogout={handleLogout} />
                        </ProtectedRoute>
                    } 
                />

                {/* Chatbot */}
                <Route 
                    path="/chatbot" 
                    element={
                        <ProtectedRoute token={token}>
                            <Chatbot token={token} />
                        </ProtectedRoute>
                    } 
                />

                {/* Profile */}
                <Route 
                    path="/profile" 
                    element={
                        <ProtectedRoute token={token}>
                            <Profile token={token} onLogout={handleLogout} /> 
                        </ProtectedRoute>
                    } 
                />

                {/* Appointments */}
                <Route 
                    path="/appointments" 
                    element={
                        <ProtectedRoute token={token}>
                            <Appointments token={token} onLogout={handleLogout} /> 
                        </ProtectedRoute>
                    } 
                />

                {/* ✅ Admin Page */}
                <Route 
                    path="/admin"
                    element={
                        <ProtectedRoute token={token}>
                            <AdminPage token={token} onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />

                {/* AboutUs */}
                <Route 
                    path="/aboutus" 
                    element={
                        <ProtectedRoute token={token}>
                            <AboutUs token={token} />
                        </ProtectedRoute>
                    } 
                />

                {/* Fallback: If unknown route */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;


// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// const App = ({ token }) => {
//     const [appointments, setAppointments] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // Rescheduling States
//     const [selectedAppointment, setSelectedAppointment] = useState(null);
//     const [availableSlots, setAvailableSlots] = useState([]);
//     const [loadingSlots, setLoadingSlots] = useState(false);
//     const [rescheduleDate, setRescheduleDate] = useState("");

//     const fetchAppointments = useCallback(async () => {
//         try {
//             const res = await axios.get('http://localhost:3001/api/admin/appointments', {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setAppointments(res.data);
//             setLoading(false);
//         } catch (err) {
//             console.error("Data load error", err);
//             setLoading(false);
//         }
//     }, [token]);

//     useEffect(() => {
//         fetchAppointments();
//     }, [fetchAppointments]);

//     const handleDateChange = async (date, doctorId) => {
//         setRescheduleDate(date);
//         if (!date || !doctorId) return;

//         setLoadingSlots(true);
//         setAvailableSlots([]);
//         try {
//             const res = await axios.get(`http://localhost:3001/api/appointments/availability/${doctorId}/${date}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setAvailableSlots(res.data.slots || []);
//         } catch (err) {
//             console.error("Slots fetch error", err);
//         } finally {
//             setLoadingSlots(false);
//         }
//     };

//     const handleRescheduleSubmit = async (appId, slot) => {
//         try {
//             const res = await axios.patch(`http://localhost:3001/api/admin/update-slot/${appId}`, {
//                 newStartTime: slot.start_time_ts,
//                 newEndTime: slot.end_time_ts,
//                 availabilitySlotRef: slot.availabilitySlotRef,
//             }, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (res.data.success) {
//                 setSelectedAppointment(null);
//                 setAvailableSlots([]);
//                 fetchAppointments();
//             }
//         } catch (err) {
//             alert(err.response?.data?.error || "Update failed");
//         }
//     };

//     return (
//         <div className="home-container">
//             <style>{`
//                 :root {
//                     --color-primary-blue: #007bff;
//                     --color-deep-blue: #003366;
//                     --color-secondary-red: #ff3b3f;
//                     --glass-bg: rgba(255, 255, 255, 0.85);
//                     --glass-border: rgba(255, 255, 255, 0.4);
//                 }

//                 * { box-sizing: border-box; transition: all 0.3s ease; }

//                 .home-container {
//                     background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
//                     min-height: 100vh;
//                     font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
//                     position: relative;
//                     padding: 30px;
//                     display: flex;
//                     justify-content: center;
//                     align-items: center;
//                     overflow: hidden;
//                 }

//                 .blob {
//                     position: absolute;
//                     width: 500px;
//                     height: 500px;
//                     background: var(--color-primary-blue);
//                     filter: blur(100px);
//                     opacity: 0.15;
//                     border-radius: 50%;
//                     z-index: 0;
//                     animation: move 20s infinite alternate;
//                 }
//                 .blob-red { background: var(--color-secondary-red); top: -100px; right: -100px; animation-delay: -5s; }
//                 .blob-blue { bottom: -100px; left: -100px; }

//                 @keyframes move {
//                     from { transform: translate(0, 0); }
//                     to { transform: translate(100px, 100px); }
//                 }

//                 .main-content-wrapper {
//                     background: var(--glass-bg);
//                     backdrop-filter: blur(15px);
//                     border: 1px solid var(--glass-border);
//                     border-radius: 30px;
//                     width: 100%;
//                     max-width: 1100px;
//                     box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
//                     position: relative;
//                     z-index: 1;
//                     overflow: hidden;
//                     display: flex;
//                     flex-direction: column;
//                 }

//                 .header-strip {
//                     height: 8px;
//                     background: linear-gradient(90deg, var(--color-primary-blue), var(--color-secondary-red));
//                 }

//                 .navbar {
//                     display: flex;
//                     justify-content: space-between;
//                     align-items: center;
//                     padding: 25px 40px;
//                     background: rgba(255, 255, 255, 0.3);
//                 }

//                 .logo {
//                     font-size: 1.5em;
//                     font-weight: 800;
//                     letter-spacing: -1px;
//                     color: var(--color-deep-blue);
//                 }
//                 .logo span { color: var(--color-secondary-red); }

//                 .nav-links a {
//                     text-decoration: none;
//                     color: #555;
//                     font-weight: 600;
//                     margin-left: 30px;
//                     font-size: 0.95em;
//                 }
//                 .nav-links a:hover { color: var(--color-primary-blue); }

//                 .logout-btn {
//                     background: #333;
//                     color: white !important;
//                     padding: 10px 22px;
//                     border-radius: 12px;
//                     box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//                 }
//                 .logout-btn:hover { transform: translateY(-2px); background: #000; }

//                 .content-section {
//                     display: grid;
//                     grid-template-columns: 380px 1fr;
//                     padding: 40px;
//                     gap: 40px;
//                 }

//                 .hero-content h1 {
//                     font-size: 2.5em;
//                     line-height: 1.1;
//                     color: var(--color-deep-blue);
//                     margin-bottom: 15px;
//                 }

//                 .card {
//                     background: white;
//                     border-radius: 24px;
//                     padding: 24px;
//                     border: 1px solid #f0f0f0;
//                     box-shadow: 0 10px 20px rgba(0,0,0,0.02);
//                 }

//                 .appointment-table { width: 100%; border-collapse: separate; border-spacing: 0 10px; }
//                 .appointment-table th { padding: 12px; color: #999; font-weight: 500; font-size: 0.85em; text-transform: uppercase; letter-spacing: 1px; }
//                 .appointment-table tr { background: #fafafa; border-radius: 12px; }
//                 .appointment-table td { padding: 15px 12px; }
//                 .appointment-table tr:hover { background: #f0f7ff; cursor: pointer; }

//                 .status-badge {
//                     padding: 5px 12px;
//                     border-radius: 20px;
//                     font-size: 0.75em;
//                     font-weight: 700;
//                     background: #e1f5fe;
//                     color: #01579b;
//                 }

//                 .update-btn {
//                     border: none;
//                     background: var(--color-secondary-red);
//                     color: white;
//                     padding: 8px 16px;
//                     border-radius: 10px;
//                     font-weight: 600;
//                     cursor: pointer;
//                     font-size: 0.85em;
//                 }
//                 .update-btn:hover { background: #d32f2f; box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3); }

//                 .reschedule-popover {
//                     position: absolute;
//                     top: 100%;
//                     right: 0;
//                     z-index: 50;
//                     background: white;
//                     width: 280px;
//                     padding: 20px;
//                     border-radius: 20px;
//                     box-shadow: 0 20px 40px rgba(0,0,0,0.2);
//                     border: 1px solid #eee;
//                     margin-top: 10px;
//                 }

//                 .slot-grid {
//                     display: grid;
//                     grid-template-columns: 1fr 1fr;
//                     gap: 8px;
//                     max-height: 120px;
//                     overflow-y: auto;
//                     margin-top: 12px;
//                     padding-right: 5px;
//                 }
//                 .slot-btn {
//                     padding: 8px;
//                     font-size: 0.75em;
//                     border: 1px solid #e0e0e0;
//                     background: white;
//                     border-radius: 8px;
//                     cursor: pointer;
//                 }
//                 .slot-btn:hover { background: var(--color-primary-blue); color: white; border-color: var(--color-primary-blue); }

//                 .footer {
//                     padding: 20px;
//                     text-align: center;
//                     font-size: 0.8em;
//                     color: #999;
//                     background: rgba(255,255,255,0.2);
//                 }
//             `}</style>

//             <div className="blob blob-red"></div>
//             <div className="blob blob-blue"></div>

//             <div className="main-content-wrapper">
//                 <div className="header-strip"></div>
                
//                 <header className="navbar">
//                     <div className="logo">HEALTH<span>PRO</span></div>
//                     <nav className="nav-links">
//                         <a href="#dash">Overview</a>
//                         <a href="#schedule">Calendar</a>
//                         <a href="#logout" className="logout-btn">Sign Out</a>
//                     </nav>
//                 </header>

//                 <main className="content-section">
//                     <aside className="hero-content">
//                         <h1>Manage Your <span className="text-red">Patient</span> Flow.</h1>
//                         <p style={{ color: '#666', lineHeight: '1.6' }}>
//                             Aapna patients ni details ane appointment slots ne manage karo ek j jagya par thi.
//                         </p>
                        
//                         <div className="card" style={{ marginTop: '30px', background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)', color: 'white' }}>
//                             <div style={{ fontSize: '0.9em', opacity: 0.8 }}>Total Appointments</div>
//                             <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>{appointments.length}</div>
//                             <div style={{ fontSize: '0.8em', marginTop: '10px' }}>↑ 12% increase from yesterday</div>
//                         </div>
//                     </aside>

//                     <div className="card">
//                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                             <h3 style={{ margin: 0, color: '#333' }}>Recent Activity</h3>
//                             <button style={{ background: 'none', border: 'none', color: 'var(--color-primary-blue)', fontWeight: 'bold', cursor: 'pointer' }}>View All</button>
//                         </div>

//                         {loading ? (
//                             <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Loading appointments...</div>
//                         ) : (
//                             <div style={{ overflowX: 'auto' }}>
//                                 <table className="appointment-table">
//                                     <thead>
//                                         <tr>
//                                             <th>Patient Name</th>
//                                             <th>Doctor</th>
//                                             <th>Time Slot</th>
//                                             <th>Action</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {appointments.map(app => {
//                                             // Patient Name logic: humne backend se 'username' populate kiya hai
//                                             const patientName = app.patient_id?.username || app.patient_name || "Unknown Patient";
                                            
//                                             // Doctor Name logic
//                                             const doctorName = app.doctor_id?.first_name 
//                                                 ? `Dr. ${app.doctor_id.first_name} ${app.doctor_id.last_name || ""}` 
//                                                 : "Dr. Specialist";
                                            
//                                             const doctorId = app.doctor_id?._id || app.doctor_id;

//                                             return (
//                                                 <tr key={app._id}>
//                                                     <td>
//                                                         <div style={{ fontWeight: '700', color: '#333' }}>{patientName}</div>
//                                                         <div style={{ fontSize: '0.7em', color: '#aaa' }}>
//                                                             ID: {typeof (app.patient_id?._id || app.patient_id) === 'string' ? (app.patient_id?._id || app.patient_id).slice(-8).toUpperCase() : "UID"}
//                                                         </div>
//                                                     </td>
//                                                     <td>
//                                                         <div style={{ fontSize: '0.9em', color: '#555' }}>{doctorName}</div>
//                                                         <div className="status-badge">Confirmed</div>
//                                                     </td>
//                                                     <td>
//                                                         <div style={{ fontSize: '0.9em', fontWeight: '600' }}>
//                                                             {new Date(app.start_time_ts).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
//                                                         </div>
//                                                         <div style={{ fontSize: '0.8em', color: '#888' }}>
//                                                             {new Date(app.start_time_ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                                         </div>
//                                                     </td>
//                                                     <td style={{ position: 'relative' }}>
//                                                         <button className="update-btn" onClick={() => setSelectedAppointment(app._id)}>Reschedule</button>
                                                        
//                                                         {selectedAppointment === app._id && (
//                                                             <div className="reschedule-popover">
//                                                                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//                                                                     <span style={{ fontSize: '0.8em', fontWeight: 'bold' }}>Select New Date</span>
//                                                                     <span onClick={() => setSelectedAppointment(null)} style={{ cursor: 'pointer', fontSize: '12px' }}>✕</span>
//                                                                 </div>
//                                                                 <input 
//                                                                     type="date" 
//                                                                     min={new Date().toISOString().split("T")[0]}
//                                                                     style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9em' }}
//                                                                     onChange={(e) => handleDateChange(e.target.value, doctorId)}
//                                                                 />

//                                                                 {loadingSlots && <div style={{ fontSize: '10px', marginTop: '10px', textAlign: 'center' }}>Searching slots...</div>}

//                                                                 <div className="slot-grid">
//                                                                     {availableSlots.map((slot, idx) => (
//                                                                         <button key={idx} className="slot-btn" onClick={() => handleRescheduleSubmit(app._id, slot)}>
//                                                                             {slot.display_time}
//                                                                         </button>
//                                                                     ))}
//                                                                 </div>
//                                                             </div>
//                                                         )}
//                                                     </td>
//                                                 </tr>
//                                             );
//                                         })}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>
//                 </main>

//                 <footer className="footer">
//                     Aapnu Swasthya, Amari Prathamikta. © 2025 HealthPro Admin.
//                 </footer>
//             </div>
//         </div>
//     );
// };

// export default App;