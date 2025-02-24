const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
require("dotenv").config();
const app = express(); 
const server = http.createServer(app);

 
app.use(
  cors({
    origin: ["https://slots-kr12.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
const io = new Server(server, {
  cors: {
    origin: "https://slots-kr12.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});



const mongoURI = process.env.MONGO_URI; 
// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workingHours: {
    start: { type: String, required: true }, 
    end: { type: String, required: true },  
  },
  specialization: { type: String,required:true },
});
// Doctor Schema 
  
const Doctor = mongoose.model("Doctor", DoctorSchema);

// Appointment Schema
const AppointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  date: Date,
  duration: Number,
  appointmentType: String,
  patientName: String,
  notes: String,
});
const Appointment = mongoose.model("Appointment", AppointmentSchema);

// Dummy Data (Run once)
const insertDummyData = async () => {
  const count = await Doctor.countDocuments();
  if (count === 0) {
    await Doctor.insertMany([
      { name: "Dr. John Smith", specialization: "Cardiologist", workingHours: { start: "09:00", end: "17:00" } },
      { name: "Dr. Emily Johnson", specialization: "Pediatrician", workingHours: { start: "10:00", end: "18:00" } },
      { name: "Dr. Michael Brown", specialization: "Dermatologist", workingHours: { start: "08:00", end: "16:00" } },
    ]);
    console.log("Dummy doctors inserted");
  }
};
insertDummyData();

// Generate available time slots
const generateTimeSlots = (start, end, duration = 30) => {
  const slots = [];
  let currentTime = new Date(`2025-02-23T${start}:00`);
  const endTime = new Date(`2025-02-23T${end}:00`);

  while (currentTime < endTime) {
    slots.push(new Date(currentTime));
    currentTime.setMinutes(currentTime.getMinutes() + duration);
  }
  return slots;
};

// Get all doctors
app.get("/doctors", async (req, res) => {
  const doctors = await Doctor.find();
  res.json(doctors);
});


//Get all slots avaialble for specific doctor

app.get("/doctors/:id/slots", async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid doctor ID format" });
    }

    // Validate date input
    if (!date) return res.status(400).json({ error: "Date is required" });

    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    const { workingHours } = doctor;
    if (!workingHours) return res.status(400).json({ error: "Doctor's working hours not set" });

   
    const selectedDate = new Date(date); 
    selectedDate.setHours(0, 0, 0, 0);

    const startTime = new Date(selectedDate);
    const endTime = new Date(selectedDate);

    // Apply doctor's working hours properly
    const [startHour, startMinute] = workingHours.start.split(":").map(Number);
    const [endHour, endMinute] = workingHours.end.split(":").map(Number);

    startTime.setHours(startHour, startMinute, 0, 0);
    endTime.setHours(endHour, endMinute, 0, 0);

    const slots = [];
    const slotDuration = 30; // 30-minute slots

    while (startTime < endTime) {
      slots.push({
        time: new Date(startTime).toISOString(),
        isBooked: false,
      });
      startTime.setMinutes(startTime.getMinutes() + slotDuration);
    }

    // Fetch booked appointments and mark booked slots
    const bookedAppointments = await Appointment.find({
      doctorId: id,
      date: {
        $gte: selectedDate,
        $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000), // Ensure end of the same day
      },
    });

    const bookedTimes = bookedAppointments.map((app) => app.date.toISOString());

    slots.forEach((slot) => {
      if (bookedTimes.includes(slot.time)) {
        slot.isBooked = true;
      }
    });

    res.json({ slots });
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});






// Get all appointments
app.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("doctorId", "name"); // Fetch doctor name
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// Get a specific appointment
app.get("/appointments/:id", async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ error: "Appointment not found" });
  res.json(appointment);
});

// Book an appointment
app.post("/appointments", async (req, res) => {
    const { doctorId, date } = req.body;
  
    const existingAppointment = await Appointment.findOne({ doctorId, date: new Date(date) });
    if (existingAppointment) {
      return res.status(400).json({ error: "Slot already booked" });
    }
  
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
  
    io.emit("appointment update", { doctorId });
    res.status(201).json(newAppointment);
  });

// Update an appointment
app.put("/appointments/:id", async (req, res) => {
    try {
      const { doctorId, date, duration, appointmentType, patientName, notes } = req.body;
  
      // Convert date string to a proper Date object
      const appointmentDate = new Date(date);
      if (isNaN(appointmentDate)) {
        return res.status(400).json({ error: "Invalid date format" });
      }
  
      // Check if the new appointment time conflicts with existing ones
      const existingAppointment = await Appointment.findOne({
        doctorId,
        date: appointmentDate,
        _id: { $ne: req.params.id }, // Exclude the current appointment being updated
      });
  
      if (existingAppointment) {
        return res.status(400).json({ message: "Slot already booked" });
      }
  
      // Update the appointment
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        { doctorId, date: appointmentDate, duration, appointmentType, patientName, notes },
        { new: true, runValidators: true }
      );
  
      if (!updatedAppointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
  
      // Notify clients about the update
      io.emit("appointment update", { doctorId });
  
      res.json(updatedAppointment);
    } catch (error) {
      res.status(500).json({ error: "Internal server error", details: error.message });
    }
  });
  
// Cancel an appointment
app.delete("/appointments/:id", async (req, res) => {
  const appointment = await Appointment.findByIdAndDelete(req.params.id);
  if (!appointment) return res.status(404).json({ error: "Appointment not found" });

  io.emit("appointment update", { doctorId: appointment.doctorId });
  res.json({ message: "Appointment cancelled" });
});

// Start server
server.listen(5000, () => console.log("Server running on port 5000"));
