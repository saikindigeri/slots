// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import io from "socket.io-client";

// const socket = io("http://localhost:5000");

// const AppointmentBooking = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [date, setDate] = useState(new Date());
//   const [slots, setSlots] = useState([]);
//   const [appointments, setAppointments] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingAppointment, setEditingAppointment] = useState(null);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [error, setError] = useState("");
//   const [bookingData, setBookingData] = useState({
//     patientName: "",
//     appointmentType: "Routine Check-Up",
//     notes: "",
//   });

//   useEffect(() => {
//     axios.get("http://localhost:5000/doctors").then((res) => setDoctors(res.data));
//   }, []);

//   useEffect(() => {
//     if (selectedDoctor) {
//       axios
//         .get(`http://localhost:5000/doctors/${selectedDoctor}/slots?date=${date.toISOString().split("T")[0]}`)
//         .then((res) => setSlots(res.data));
//     }
//   }, [selectedDoctor, date]);

//   useEffect(() => {
//     axios.get("http://localhost:5000/appointments").then((res) => setAppointments(res.data));
//     socket.on("appointment update", () => {
//       axios.get("http://localhost:5000/appointments").then((res) => setAppointments(res.data));
//     });
//     return () => socket.off("appointment update");
//   }, []);

//   const handleBookAppointment = (slot) => {
//     setSelectedSlot(slot);
//     setShowForm(true);
//   };

//   const handleEditAppointment = (appointment) => {
//     setEditingAppointment(appointment);
//     setShowForm(true);
//     setSelectedDoctor(appointment.doctorId);
//     setSelectedSlot( new Date(appointment.date).toISOString(),  );
//     setBookingData({
//       patientName: appointment.patientName,
//       appointmentType: appointment.appointmentType,
//       notes: appointment.notes || "",
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!bookingData.patientName || !selectedDoctor || !selectedSlot) {
//       setError("All fields are required.");
//       return;
//     }
//     const appointment = {
//       ...bookingData,
//       doctorId: selectedDoctor,
//       date: new Date(selectedSlot).toISOString(),  
//       duration: 30,
//     };



  
//     if (editingAppointment) {
//       axios.put(`http://localhost:5000/appointments/${editingAppointment._id}`, appointment).then(() => {
//         socket.emit("appointment update");
//         alert("Appointment updated successfully!");
//         setShowForm(false);
//       });
//     } else {
//       axios.post("http://localhost:5000/appointments", appointment).then(() => {
//         socket.emit("appointment update");
//         alert("Appointment booked successfully!");
//         setShowForm(false);
//       });
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold">Book an Appointment</h1>
//       <div className="mt-4">
//         <h2>Select a Doctor:</h2>
//         <div className="grid grid-cols-2 gap-4">
//           {doctors.map((doc) => (
//             <button key={doc._id} className="p-2 border rounded bg-blue-300 hover:bg-blue-400" onClick={() => setSelectedDoctor(doc._id)}>
//               {doc.name}
//             </button>
//           ))}
//         </div>
//       </div>
//       {selectedDoctor && (
//         <>
//           <div className="mt-4">
//             <h2>Select Date:</h2>
//             <Calendar onChange={setDate} value={date} minDate={new Date()} maxDate={new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)} />
//           </div>
//           <h2 className="mt-4 text-xl">Available Slots:</h2>
//           <div className="grid grid-cols-3 gap-2">
//             {slots.map((slot, index) => (
//               <button key={index} className="p-2 border rounded bg-green-300 hover:bg-green-400" onClick={() => handleBookAppointment(slot)}>
//                 {new Date(slot).toLocaleTimeString()}
//               </button>
//             ))}
//           </div>
//         </>
//       )}
//       {showForm && (
//         <div className="mt-4 p-4 border rounded bg-gray-100">
//           <h2>Book Appointment</h2>
//           <form onSubmit={handleSubmit}>
//             <label>Patient Name:</label>
//             <input type="text" className="border p-2 w-full" value={bookingData.patientName} onChange={(e) => setBookingData({ ...bookingData, patientName: e.target.value })} required />
//             <label>Appointment Type:</label>
//             <select className="border p-2 w-full" value={bookingData.appointmentType} onChange={(e) => setBookingData({ ...bookingData, appointmentType: e.target.value })}>
//               <option>Routine Check-Up</option>
//               <option>Ultrasound</option>
//             </select>
//             <label>Notes:</label>
//             <textarea className="border p-2 w-full" value={bookingData.notes} onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}></textarea>
//             <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded">Confirm Appointment</button>
//           </form>
//         </div>
//       )}
//       <h2 className="mt-6 text-xl">Upcoming Appointments:</h2>
//       <ul>
//         {appointments.map((appt) => (
//           <li key={appt._id} className="border p-2 my-2 flex justify-between items-center">
//             <span>{appt.patientName} - {appt.appointmentType} - {new Date(appt.date).toLocaleString()}</span>
//             <div>
//             <button className="bg-blue-500 text-white px-2 py-1 rounded mx-1" onClick={() => handleEditAppointment(appt)}>Edit</button>
//               <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => axios.delete(`http://localhost:5000/appointments/${appt._id}`).then(() => socket.emit("appointment update"))}>Cancel</button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default AppointmentBooking;

/*
import  { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import io from "socket.io-client";
import DoctorSelection from "./components/DoctorSelection";
import AppointmentForm from "./components/AppointmentForm";
import AppointmentList from "./components/AppointmentList";
import AvailableSlots from "./components/AvailableSlots";
import "./App.css";

const socket = io("http://localhost:5000");

const AppointmentBooking = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [error, setError] = useState("");
  const [bookingData, setBookingData] = useState({
    patientName: "",
    appointmentType: "Routine Check-Up",
    notes: "",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/doctors").then((res) => setDoctors(res.data));
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      axios
        .get(`http://localhost:5000/doctors/${selectedDoctor}/slots?date=${date.toISOString().split("T")[0]}`)
        .then((res) => setSlots(res.data));
    }
  }, [selectedDoctor, date]);

  useEffect(() => {
    axios.get("http://localhost:5000/appointments").then((res) => setAppointments(res.data));
    socket.on("appointment update", () => {
      axios.get("http://localhost:5000/appointments").then((res) => setAppointments(res.data));
    });
    return () => socket.off("appointment update");
  }, []);

  const handleBookAppointment = (slot) => {
    setSelectedSlot(slot);
    setShowForm(true);
    setEditingAppointment(null);
    setBookingData({
      patientName: "",
      appointmentType: "Routine Check-Up",
      notes: "",
    });
    setError("");
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
    setSelectedDoctor(appointment.doctorId);
    setSelectedSlot(appointment.date);
    setBookingData({
      patientName: appointment.patientName,
      appointmentType: appointment.appointmentType,
      notes: appointment.notes || "",
    });
    setError("");
  };

  return (
    <div className="appointment-container">
      <h1 className="appointment-title">Book an Appointment</h1>
      <DoctorSelection doctors={doctors} setSelectedDoctor={setSelectedDoctor} />
      {selectedDoctor && (
        <>
          <div className="calendar-container">
            <h2>Select Date:</h2>
            <div className="calendar-wrapper">
              <Calendar
                onChange={setDate}
                value={date}
                minDate={new Date()}
                maxDate={new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)}
              />
            </div>
          </div>
          <AvailableSlots slots={slots} handleBookAppointment={handleBookAppointment} appointments={appointments} />
        </>
      )}
      {showForm && (
        <AppointmentForm
          bookingData={bookingData}
          setBookingData={setBookingData}
          selectedSlot={selectedSlot}
          setShowForm={setShowForm}
          editingAppointment={editingAppointment}
          setError={setError}
          error={error}
          selectedDoctor={selectedDoctor}
          socket={socket}
        />
      )}
      <AppointmentList appointments={appointments} handleEditAppointment={handleEditAppointment} socket={socket} />
    </div>
  );
};

export default AppointmentBooking;
*/


import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./pages/Header";
import Home from "./pages/Home";
import Appointments from "./pages/Appointments";
import DoctorsPage from "./pages/Doctors";
import DoctorDetails from "./pages/DoctorDetails";
;


function App() {
  return (
    <Router>
      <Header />
      <div className="pt-16"> {/* Prevent content from hiding behind fixed header */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctors/:id" element={<DoctorDetails/>} />
 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
