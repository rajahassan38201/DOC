import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, ArrowLeft, MessageSquare, Bot, ShieldAlert } from 'lucide-react';
import axios from 'axios';

// Note: Hum yahan wahi Appointment component use karenge jo aapne specify kiya tha
// Lekin styling Tailwind ke through handle hogi.
import Appointment from './AppointmentBooking.js';

const Chatbot = ({ token }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    // Recommended Doctor State Variables
    const [recommendedDoctor, setRecommendedDoctor] = useState(null);
    const [recommendedDoctorId, setRecommendedDoctorId] = useState(null);
    const [isBookingMode, setIsBookingMode] = useState(false);

    // Initial greeting
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{ 
                sender: 'bot', 
                text: "Hello! I'm your Shifa Hospital Assistant. Tell me your symptoms, and I'll find the right specialist for you." 
            }]);
        }
    }, [messages.length]);

    // Back button from AppointmentBooking
    const handleBackToChat = () => {
        setIsBookingMode(false);
        const doctor = recommendedDoctor || 'the doctor you were previously recommended';
        setMessages(prev => [...prev, { 
            sender: 'bot', 
            text: `You are back in the chat. You can ask a new question or click the 'Book Now' button below to book an appointment with ${doctor}.` 
        }]);
    };

    // Handles the click on the "Book Now" button
    const handleBookNowClick = () => {
        if (!token) {
            setMessages(prev => [...prev, {
                sender: 'bot',
                text: "⚠️ Authentication Required: Please log in to your account before proceeding to book an appointment. You can do this via the Home page.",
                isError: true
            }]);
            return;
        }
        setIsBookingMode(true);
    };

    // Send message to backend
    const handleSend = useCallback(async () => {
        if (!input.trim() || loading) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        setRecommendedDoctor(null);
        setRecommendedDoctorId(null);
        setIsBookingMode(false);

        try {
            const response = await axios.post('http://localhost:3001/api/chat', { query: input });
            const botText = response.data.response || "Sorry, I couldn't find a suitable doctor.";

            setMessages(prev => [...prev, { sender: 'bot', text: botText }]);

            if (response.data.doctorId) {
                const match = botText.match(/Dr\.\s*([^.]+)/);
                const doctorName = match ? match[0].trim() : "the recommended doctor";

                setRecommendedDoctor(doctorName); 
                setRecommendedDoctorId(response.data.doctorId);
                
                setMessages(prev => [...prev, { 
                    sender: 'bot', 
                    text: `If you wish to proceed with booking, click the "Book Now" button below.` 
                }]);
            }

        } catch (error) {
            setMessages(prev => [...prev, { 
                sender: 'bot', 
                text: "Apologies. The system is temporarily down. Please ensure your backend server is running correctly." 
            }]);
        } finally {
            setLoading(false);
        }
    }, [input, loading]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="relative min-h-screen w-full bg-white overflow-hidden font-sans">
            
            {/* Background Blobs (Matching Home.jsx) */}
            <div className="absolute top-[10%] -left-[5%] w-[300px] h-[300px] bg-[#40a9ff] rounded-full blur-[80px] opacity-10 pointer-events-none" />
            <div className="absolute bottom-[5%] -right-[10%] w-[400px] h-[400px] bg-[#f30004] rounded-full blur-[80px] opacity-10 pointer-events-none" />

            <div className="relative z-10 m-2 md:m-5 p-4 md:p-5 bg-white/80 backdrop-blur-md rounded-[25px] shadow-xl border border-white/20 min-h-[calc(100vh-40px)] flex flex-col">
                
                {/* Navbar Area */}
                <header className="flex justify-between items-center px-4 md:px-8 h-20 bg-[#40a9ff] rounded-t-[20px] shadow-lg text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center -rotate-6 shadow-md">
                             <span className="text-[#40a9ff] font-bold text-lg">S</span>
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight">SHIFA CHATBOT</h1>
                    </div>
                    <nav className="flex items-center gap-4">
                        <Link to="/" className="hover:text-[#f30004] transition-colors font-medium">Home</Link>
                        {isBookingMode && (
                            <button 
                                onClick={handleBackToChat}
                                className="flex items-center gap-2 bg-[#f30004] px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:scale-105 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Chat
                            </button>
                        )}
                    </nav>
                </header>

                <main className="flex-grow flex flex-col mt-4 overflow-hidden relative">
                    {isBookingMode && recommendedDoctor ? (
                        <div className="flex-grow overflow-y-auto rounded-xl bg-gray-50/50 p-4 border border-gray-100">
                            <Appointment 
                                token={token}
                                doctorName={recommendedDoctor}
                                doctorId={recommendedDoctorId} 
                                onBack={handleBackToChat} 
                            />
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col max-w-4xl mx-auto w-full">
                            {/* Messages Container */}
                            <div className="flex-grow overflow-y-auto px-2 md:px-4 py-6 space-y-4 scroll-smooth">
                                {messages.map((msg, index) => (
                                    <div 
                                        key={index} 
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                                    >
                                        <div className={`max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl shadow-sm ${
                                            msg.sender === 'user' 
                                                ? 'bg-[#40a9ff] text-white rounded-tr-none' 
                                                : msg.isError 
                                                    ? 'bg-red-50 text-red-700 border border-red-100 rounded-tl-none'
                                                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                        }`}>
                                            <div className="flex items-start gap-2">
                                                {msg.sender === 'bot' && (
                                                    msg.isError ? <ShieldAlert className="w-5 h-5 mt-0.5" /> : <Bot className="w-5 h-5 mt-0.5 text-[#40a9ff]" />
                                                )}
                                                <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                            <div className="flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-[#40a9ff] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                <span className="w-1.5 h-1.5 bg-[#40a9ff] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                <span className="w-1.5 h-1.5 bg-[#40a9ff] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                            </div>
                                            <span className="text-xs text-gray-400 font-medium italic">Assistant is typing...</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Book Now Floating CTA */}
                            {recommendedDoctor && !loading && (
                                <div className="px-4 py-2 flex justify-center animate-in fade-in zoom-in duration-500">
                                    <button 
                                        onClick={handleBookNowClick}
                                        className="bg-[#f30004] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border-2 border-white"
                                    >
                                        <MessageSquare className="w-5 h-5" /> Book Now with {recommendedDoctor}
                                    </button>
                                </div>
                            )}

                            {/* Input Area */}
                            <div className="p-4 bg-white border-t border-gray-100">
                                <div className="relative max-w-3xl mx-auto">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Describe your symptoms (e.g., 'I have a severe headache')"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-[#40a9ff] transition-all text-gray-700"
                                        disabled={loading}
                                    />
                                    <button 
                                        onClick={handleSend}
                                        disabled={loading || !input.trim()}
                                        className="absolute right-2 top-2 bottom-2 bg-[#40a9ff] text-white px-4 rounded-xl shadow-md hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-[#40a9ff] transition-all"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-center text-[10px] text-gray-400 mt-2 uppercase tracking-widest">
                                    Shifa Medical AI • Professional Guidance
                                </p>
                            </div>
                        </div>
                    )}
                </main>

                <footer className="text-center py-4 text-xs text-gray-400 font-medium">
                    &copy; {new Date().getFullYear()} Shifa Tameer-e-Millat University
                </footer>
            </div>
        </div>
    );
};

export default Chatbot;