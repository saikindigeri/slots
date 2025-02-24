import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import io from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const socket = io("http://localhost:5000");

const DoctorDetails = () => {
  const { id } = useParams();
  const [date, setDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [bookingData, setBookingData] = useState({
    patientName: "",
    contactNumber: "",
    appointmentType: "Routine Check-Up",
    notes: "",
  });

  useEffect(() => {
    const fetchSlots = () => {
      
      const formattedDate = date.toLocaleDateString("en-CA");
      console.log(formattedDate);

      console.log("Selected Date:", date.toLocaleDateString());

      axios
        .get(`http://localhost:5000/doctors/${id}/slots?date=${formattedDate}`)
        .then((res) => {
          setSlots(res.data.slots || []);
          console.log(res.data.slots);
        })

        .catch((err) => {
          console.error("Error fetching slots:", err);
          setSlots([]);
        });
    };



    fetchSlots();
    socket.on("appointment update", fetchSlots);

    return () => socket.off("appointment update");
  }, [id, date]);

  // Handle slot selection
  const handleBookAppointment = (slot) => {
    if (slot.isBooked) {
      setError("This slot is already booked.");
      return;
    }
    setSelectedSlot(slot.time);
    setShowForm(true);
    setError("");
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !bookingData.patientName ||
      !bookingData.contactNumber ||
      !selectedSlot
    ) {
      setError("All fields are required.");
      return;
    }

    const appointment = {
      ...bookingData,
      doctorId: id,
      date: new Date(selectedSlot).toISOString(),
      duration: 30,
    };

    axios
      .post("http://localhost:5000/appointments", appointment)
      .then(() => {
        socket.emit("appointment update");
        toast.success("Appointment booked successfully!");
        setShowForm(false);
        setSelectedSlot(null);
      })
      
      .catch((err) => console.error("Error booking appointment:", err));
      toast.error("Error with booking appointment")
  };

  return (
    <div className="min-h-screen flex flex-col">
        
      <div className="max-w-4xl mx-auto w-full p-6">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Book an Appointment
        </h2>
        <ToastContainer className="mt-4" position="top-right" autoClose={3000} hideProgressBar />
        {/* Calendar Selection */}
        <div className="flex justify-center my-6">
          <Calendar
            onChange={(selectedDate) => {
              setDate(selectedDate); 
              console.log("User Selected Date:", selectedDate);
            }}
            value={date}
            minDate={new Date()} 
            className="border rounded-lg p-2 shadow-md"
          />
        </div>

    
        <h3 className="text-xl font-semibold mt-6 text-center text-gray-700">
          Available Slots:
        </h3>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {slots.length > 0 ? (
            slots.map((slot, index) => (
              <button
                key={index}
                onClick={() => handleBookAppointment(slot)}
                className={`px-6 py-2 rounded-lg text-lg font-medium transition ${
                  slot.isBooked
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white shadow-lg"
                }`}
                disabled={slot.isBooked}
              >
                {new Date(slot.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </button>
            ))
          ) : (
            <p className="text-red-500 text-center w-full">
              No slots available
            </p>
          )}
        </div>

        {/* Appointment Form */}
        {showForm && (
          <div className="mt-8 p-6 border rounded-lg shadow-lg bg-white">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Enter Your Details
            </h3>

            {error && <p className="text-red-500 mb-3">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Patient Name"
                className="w-full p-3 border rounded-lg"
                value={bookingData.patientName}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    patientName: e.target.value,
                  })
                }
                required
              />
              <input
                type="text"
                placeholder="Contact Number"
                className="w-full p-3 border rounded-lg"
                value={bookingData.contactNumber}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    contactNumber: e.target.value,
                  })
                }
                required
              />
              <select
                className="w-full p-3 border rounded-lg"
                value={bookingData.appointmentType}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    appointmentType: e.target.value,
                  })
                }
              >
                <option value="Routine Check-Up">Routine Check-Up</option>
                <option value="Consultation">Consultation</option>
                <option value="Follow-Up">Follow-Up</option>
                <option value="Emergency">Emergency</option>
              </select>
              <textarea
                placeholder="Notes (Optional)"
                className="w-full p-3 border rounded-lg"
                value={bookingData.notes}
                onChange={(e) =>
                  setBookingData({ ...bookingData, notes: e.target.value })
                }
              ></textarea>

              <button
                type="submit"
                className="w-full p-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition"
              >
                Confirm Appointment
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-4 mt-auto text-sm">
        &copy; {new Date().getFullYear()} Prenatal Care. All rights reserved.
      </footer>
    </div>
  );
};

export default DoctorDetails;
