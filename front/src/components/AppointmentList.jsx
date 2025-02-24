import axios from "axios";

const AppointmentList = ({ appointments, handleEditAppointment, socket }) => {
  return (
    <div className="mt-6 p-6 border border-gray-300 rounded-lg bg-white shadow-lg max-w-2xl mx-auto animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Upcoming Appointments</h2>
      <ul className="space-y-4">
        {appointments.map((appt) => (
          <li
            key={appt._id}
            className="border p-4 flex justify-between items-center rounded-lg shadow-md bg-gray-50 hover:bg-gray-100 transition duration-300"
          >
            <span className="text-gray-700 font-medium">
              {appt.patientName} - {appt.appointmentType} - {" "}
              {new Date(appt.date).toLocaleString()}
            </span>
            <div className="flex space-x-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                onClick={() => handleEditAppointment(appt)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                onClick={() => {
                  axios.delete(`http://localhost:5000/appointments/${appt._id}`).then(() => socket.emit("appointment update"));
                }}
              >
                Cancel
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentList;
