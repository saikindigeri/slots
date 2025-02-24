import axios from "axios";

const AppointmentForm = ({
  bookingData,
  setBookingData,
  selectedSlot,
  setShowForm,
  editingAppointment,
  setError,
  error,
  selectedDoctor,
  socket,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bookingData.patientName || !selectedDoctor || !selectedSlot) {
      setError("All fields are required.");
      return;
    }

    const appointment = {
      ...bookingData,
      doctorId: selectedDoctor,
      date: new Date(selectedSlot).toISOString(),
      duration: 30,
    };

    if (editingAppointment) {
      axios.put(`http://localhost:5000/appointments/${editingAppointment._id}`, appointment).then(() => {
        socket.emit("appointment update");
        alert("Appointment updated successfully!");
        setShowForm(false);
      });
    } else {
      axios.post("http://localhost:5000/appointments", appointment).then(() => {
        socket.emit("appointment update");
        alert("Appointment booked successfully!");
        setShowForm(false);
      });
    }
  };

  return (
    <div className="mt-6 p-6 border border-gray-300 rounded-lg bg-white shadow-lg max-w-lg mx-auto animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Book Appointment</h2>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Patient Name:</label>
          <input
            type="text"
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={bookingData.patientName}
            onChange={(e) => setBookingData({ ...bookingData, patientName: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Appointment Type:</label>
          <select
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={bookingData.appointmentType}
            onChange={(e) => setBookingData({ ...bookingData, appointmentType: e.target.value })}
          >
            <option>Routine Check-Up</option>
            <option>Ultrasound</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Notes:</label>
          <textarea
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={bookingData.notes}
            onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
          ></textarea>
        </div>
        <button 
          type="submit" 
          className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Confirm Appointment
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
