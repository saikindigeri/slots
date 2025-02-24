import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Calendar from "react-calendar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [id, setId] = useState(null);
  const [date, setDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({
    patientName: "",
    appointmentType: "",
    notes: "",
  });
  const [slots, setSlots] = useState([]);

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
  }, [id, date]);

  useEffect(() => {
    fetchAppointments();
  }, [date, selectedSlot]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/appointments");
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/appointments/${id}`);
      toast.success("Appointment deleted successfully!");
      fetchAppointments();
     
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const handleEdit = (appt) => {
    setEditing(appt._id);
    setId(appt.doctorId._id);
    setEditData({
      patientName: appt.patientName,
      appointmentType: appt.appointmentType,
      notes: appt.notes,
    });
  };

  const handleBookAppointment = (slot) => {
    if (slot.isBooked) {
      alert("Already booked");
      return;
    }
    setSelectedSlot(slot.time);
  };

  const handleSave = (apptid) => {
    if (
      !editData.patientName ||
      !editData.appointmentType ||
      !editData.notes ||
      !selectedSlot
    ) {
      alert("Enter all fields");
      return;
    }

    const appointment = {
      ...editData,
      doctorId: id,
      date: new Date(selectedSlot).toISOString(),
      duration: 30,
    };
    try {
      axios.put(`http://localhost:5000/appointments/${apptid}`, appointment);
      toast.success("Appointment updated successfully!");
      setEditing(null);

      setSelectedSlot(null);
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };
  console.log(id);

  console.log(appointments);
  return (
    <>
      <Header />
      <ToastContainer className="mt-4" position="top-right" autoClose={3000} hideProgressBar />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Upcoming Appointments
        </h2>

        <ul className="space-y-4">
          {appointments.map((appt) => (
            <li
              key={appt._id}
              className="border border-gray-200 p-4 rounded-lg shadow-md bg-white flex flex-col sm:flex-row sm:justify-between items-start sm:items-center transition-transform hover:scale-[1.02]"
            >
              {editing === appt._id ? (
                <div className="flex flex-col items-center gap-3 w-full ">
                  <Calendar
                    onChange={(selectedDate) => {
                      setDate(selectedDate);
                      console.log("User Selected Date:", selectedDate);
                    }}
                    value={date}
                    minDate={new Date()}
                    className="border rounded-lg p-2 shadow-md"
                  />

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
                      <p className="text-gray-700 text-center w-full">
                        No slots available
                      </p>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Patient Name"
                    value={editData.patientName}
                    onChange={(e) =>
                      setEditData({ ...editData, patientName: e.target.value })
                    }
                    className="border  w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />

                  <select
                    value={editData.appointmentType}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        appointmentType: e.target.value,
                      })
                    }
                    className="border w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="Routine Check-Up">Routine Check-Up</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-Up">Follow-Up</option>
                    <option value="Emergency">Emergency</option>
                  </select>

                  <textarea
                    placeholder="Notes"
                    value={editData.notes}
                    onChange={(e) =>
                      setEditData({ ...editData, notes: e.target.value })
                    }
                    className="border  w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  ></textarea>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(appt._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="text-gray-700 font-medium">
                    {appt.doctorId.name} - {appt.patientName} -{" "}
                    {appt.appointmentType} -{" "}
                    {new Date(appt.date).toLocaleString()} - {appt.duration} min
                  </span>
                  <div className="flex gap-3 mt-3 sm:mt-0">
                    <button
                      onClick={() => handleEdit(appt)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(appt._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Appointments;
