import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

// NOTE: SLOT_DURATION_MINUTES is handled by the backend now.

// --- Inline Styles (CSS ko JavaScript Object mein define kiya gaya hai) ---
const styles = {
  container: {
    // Ensuring the container is responsive and occupies sufficient space
    width: '95%',
    maxWidth: '600px',
    margin: '2rem auto', 
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
    fontFamily: 'Inter, Arial, sans-serif',
    boxSizing: 'border-box',

    // --- SCROLLABLE FIX: Content ko component ke andar scrollable banana ---
    maxHeight: '85vh', // Viewport ka 85% height use karega
    overflowY: 'auto', // Agar content is height se zyada hua to scrollbar aa jaayega
    // ----------------------------------------------------------------------
    minHeight: '400px', // Ensure a reasonable minimum height
  },
  title: {
    color: '#007bff',
    marginBottom: '1.5rem',
    textAlign: 'center',
    fontSize: '1.75rem',
    fontWeight: '700',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    fontSize: '1rem',
    marginBottom: '1rem',
    padding: '0',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.2s',
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1.25rem',
  },
  label: {
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#333',
  },
  inputField: {
    width: '100%',
    padding: '0.8rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    boxSizing: 'border-box',
    outline: 'none',
    minHeight: '40px', // Ensure minimum height for better touch target
  },
  mainButton: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '1.5rem',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s, transform 0.1s',
    boxShadow: '0 4px 6px rgba(0, 123, 255, 0.2)',
  },
  disabledButton: {
    backgroundColor: '#a0c9f8',
    cursor: 'not-allowed',
    boxShadow: 'none',
    opacity: 0.7,
  },
  statusMessage: {
    padding: '0.75rem',
    borderRadius: '6px',
    marginBottom: '1.25rem',
    fontWeight: '500',
    textAlign: 'center',
  },
  successMessage: {
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
  },
  infoMessage: {
    backgroundColor: '#cfe2ff',
    color: '#052c65',
    border: '1px solid #b6d4fe',
  },
  slotGrid: {
    display: 'grid',
    // Use a minimum column width of 80px for better visibility on small screens
    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
    gap: '10px',
    marginTop: '10px',
  },
  slotButton: {
    padding: '10px 5px',
    backgroundColor: '#f0f4f8',
    color: '#495057',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s, box-shadow 0.2s',
    fontSize: '0.9rem',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    minHeight: '44px', // Standard touch target size
  },
  selectedSlotButton: {
    backgroundColor: '#28a745',
    color: 'white',
    borderColor: '#28a745',
    boxShadow: '0 2px 4px rgba(40, 167, 69, 0.3)',
  }
};

const AppointmentBooking = ({ token, doctorId, onBack }) => {
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointmentType, setAppointmentType] = useState("In-Person");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const API_BASE_URL = "http://localhost:3001/api/appointments";

  const getMessageStyle = (msg) => {
    if (!msg) return {};
    // Check for success keywords (including the tick mark) or error keywords
    if (msg.toLowerCase().includes("error") || msg.toLowerCase().includes("kam hain")) return { ...styles.statusMessage, ...styles.errorMessage };
    if (msg.startsWith("✅") || msg.toLowerCase().includes("successfully")) return { ...styles.statusMessage, ...styles.successMessage };
    return { ...styles.statusMessage, ...styles.infoMessage };
  };

  useEffect(() => {
    if (!doctorId) return setMessage("Error: No doctor selected.");

    const loadDoctor = async () => {
      // Implemented Exponential Backoff for API call
      const MAX_RETRIES = 5;
      for (let i = 0; i < MAX_RETRIES; i++) {
        try {
          setIsLoading(true);
          setMessage("Loading doctor info...");

          const res = await axios.get(
            `http://localhost:3001/api/doctors/${doctorId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setDoctor(res.data.doctor);
          setMessage("Doctor info loaded. Select a date.");
          return; // Success, exit loop
        } catch (err) {
          if (err.response && (err.response.status === 429 || err.response.status >= 500) && i < MAX_RETRIES - 1) {
            const delay = Math.pow(2, i) * 1000;
            // No logging of retries in the console per instruction
            await new Promise(resolve => setTimeout(resolve, delay));
            continue; // Retry
          }
          console.error("Error loading doctor info:", err.response?.data?.message || err.message);
          setMessage(`Error loading doctor info: ${err.response?.status || 'Network Error'}`);
          break; // Final failure, exit loop
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadDoctor();
  }, [doctorId, token]);

  const fetchSlots = async (date) => {
    if (!date) return setMessage("Please select a date first.");
    setSelectedSlot(null); // Clear previous selection

    const availabilityUrl = `${API_BASE_URL}/availability/${doctorId}/${date}`;
    console.log("Fetching slots from URL:", availabilityUrl);

    // Implemented Exponential Backoff for API call
    const MAX_RETRIES = 5;
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        setIsLoading(true);
        setMessage("Checking availability...");

        const res = await axios.get(
          availabilityUrl,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const fetchedSlots = res.data.slots || [];

        if (fetchedSlots.length === 0) {
          setSlots([]);
          setMessage(res.data.message || "Doctor not available on this day.");
          return; // Success, exit function
        }

        setSlots(fetchedSlots);
        setMessage(res.data.message || "Slots loaded. Select a slot.");
        return; // Success, exit function
      } catch (err) {
        if (err.response && (err.response.status === 429 || err.response.status >= 500) && i < MAX_RETRIES - 1) {
          const delay = Math.pow(2, i) * 1000;
          // No logging of retries in the console per instruction
          await new Promise(resolve => setTimeout(resolve, delay));
          continue; // Retry
        }
        console.error("Error fetching availability:", err.response?.data || err);
        setMessage(err.response?.data?.message || "Error fetching availability. Check server logs/network tab.");
        setSlots([]);
        break; // Final failure, exit loop
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    if (newDate) {
      fetchSlots(newDate); // Fetch slots immediately when date changes
    }
  };

  const bookAppointment = async () => {
    if (!selectedSlot) return setMessage("Error: Please select a slot.");
    if (!reason) return setMessage("Please provide a reason for the appointment.");

    // Implemented Exponential Backoff for API call
    const MAX_RETRIES = 5;
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        setIsLoading(true);
        setMessage("Booking appointment...");

        const res = await axios.post(
          `${API_BASE_URL}/book`,
          {
            doctorId,
            date: selectedDate,
            startTimeTs: selectedSlot.start_time_ts,
            endTimeTs: selectedSlot.end_time_ts,
            type: appointmentType,
            reason,
            availabilitySlotRef: selectedSlot.availabilitySlotRef,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMessage("✅ Appointment booked successfully! " + res.data.message);
        setSelectedSlot(null);
        setReason("");
        // Optionally refresh slots to show the booked slot as unavailable
        fetchSlots(selectedDate); 
        return; // Success, exit function
      } catch (err) {
        if (err.response && (err.response.status === 429 || err.response.status >= 500) && i < MAX_RETRIES - 1) {
          const delay = Math.pow(2, i) * 1000;
          // No logging of retries in the console per instruction
          await new Promise(resolve => setTimeout(resolve, delay));
          continue; // Retry
        }
        console.error("Error booking appointment:", err.response?.data || err);
        setMessage(err.response?.data?.message || "Error booking appointment.");
        break; // Final failure, exit loop
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={onBack}>
        <span style={{ marginRight: '8px' }}>⬅</span> Back to Search
      </button>

      {doctor && (
        <h2 style={styles.title}>Book Appointment with Dr. {doctor.first_name} {doctor.last_name}</h2>
      )}

      {message && <p style={getMessageStyle(message)}>{message}</p>}

      <div style={styles.formSection}>
        <label style={styles.label} htmlFor="date-input">Select Appointment Date:</label>
        <input
          id="date-input"
          type="date"
          style={styles.inputField}
          min={today}
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      {isLoading && <p style={{ ...styles.statusMessage, ...styles.infoMessage }}>Loading...</p>}

      {slots.length > 0 && !isLoading && (
        <div style={styles.formSection}>
          <label style={styles.label}>Available Slots:</label>
          <div style={styles.slotGrid}>
            {slots.map((s, idx) => {
              const isSelected = selectedSlot && selectedSlot.start_time_ts === s.start_time_ts;
              return (
                <button
                  key={idx}
                  style={{
                    ...styles.slotButton,
                    ...(isSelected ? styles.selectedSlotButton : {}),
                  }}
                  onClick={() => setSelectedSlot(s)}
                >
                  {s.display_time}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {slots.length === 0 && selectedDate && !isLoading && (
        <p style={{ ...styles.statusMessage, ...styles.infoMessage }}>No slots available for this date.</p>
      )}

      {selectedSlot && (
        <p style={{ ...styles.statusMessage, ...styles.successMessage, borderLeft: '4px solid #28a745', paddingLeft: '1rem' }}>
          <span style={{ fontWeight: 'bold' }}>Slot selected:</span> {selectedSlot.display_time}
        </p>
      )}

      <div style={styles.formSection}>
        <label style={styles.label} htmlFor="appointment-type">Appointment Type:</label>
        <select
          id="appointment-type"
          style={styles.inputField}
          value={appointmentType}
          onChange={(e) => setAppointmentType(e.target.value)}
        >
          <option value="In-Person">In-Person</option>
          <option value="Online">Online</option>
        </select>
      </div>

      <div style={styles.formSection}>
        <label style={styles.label} htmlFor="reason-for-visit">Reason for Visit (Required):</label>
        <textarea
          id="reason-for-visit"
          style={{ ...styles.inputField, resize: 'vertical' }} // Allow vertical resizing for better user experience
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g., Routine checkup, fever, follow-up"
          rows="3"
        />
      </div>

      <button
        onClick={bookAppointment}
        disabled={!selectedSlot || isLoading || !reason}
        style={{
          ...styles.mainButton,
          ...((!selectedSlot || isLoading || !reason) ? styles.disabledButton : {}),
        }}
      >
        {isLoading ? "Processing..." : "Confirm Appointment"}
      </button>
      
      {/* FINAL SPACER has been removed as max-height/overflow is now handling the scroll */}
    </div>
  );
};

export default AppointmentBooking;