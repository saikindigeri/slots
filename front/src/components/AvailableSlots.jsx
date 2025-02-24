import toast from "react-hot-toast";

const AvailableSlots = ({ slots, handleBookAppointment, appointments }) => {
  const bookedSlots = appointments.map((appt) => new Date(appt.date).getTime());

  const handleSlotClick = (slot) => {
    const slotTime = new Date(slot).getTime();
    if (bookedSlots.includes(slotTime)) {
      toast.error("This slot is already booked! Please choose another.");
    } else {
      handleBookAppointment(slot);
    }
  };

  return (
    <div className="mt-6 p-6 border border-gray-300 rounded-lg bg-white shadow-lg max-w-2xl mx-auto animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Available Slots</h2>
      <div className="grid grid-cols-3 gap-4">
        {slots.length > 0 ? (
          slots.map((slot, index) => {
            const slotTime = new Date(slot).getTime();
            const isBooked = bookedSlots.includes(slotTime);

            return (
              <button
                key={index}
                className={`p-3 rounded-lg text-white font-semibold transition duration-300 ${
                  isBooked
                    ? "bg-red-500 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                onClick={() => handleSlotClick(slot)}
                disabled={isBooked}
              >
                {new Date(slot).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </button>
            );
          })
        ) : (
          <p className="text-red-500 text-center col-span-3">No slots available</p>
        )}
      </div>
    </div>
  );
};

export default AvailableSlots;
