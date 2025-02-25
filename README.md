# Appointment Booking System

This is a **full-stack Appointment Booking System** built using **Node.js, Express, MongoDB, and React**. The system allows users to book appointments with doctors, manage available slots, and ensure real-time updates.

## 🚀 Features
- **Doctor & Patient Management**
- **Real-time Slot Booking** (Prevents double booking)
- **REST API for Appointments & Doctors**
- **Responsive UI with React & Tailwind CSS**
- **WebSockets for Live Updates**
- **Deployed Backend on Render & Frontend on Vercel**

---

## 🛠 Tech Stack
### **Frontend**
- React.js
- Tailwind CSS
- Axios

### **Backend**
- Node.js
- Express.js
- MongoDB (Atlas)
- WebSockets (Socket.io)
- Dotenv (Environment variables)

### **Deployment**
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

---

## 📌 Installation & Setup

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/saikindigeri/slots.git
cd slots
```

### **2️⃣ Backend Setup**
```sh
cd backend
npm install
```

Create a `.env` file in the `backend` folder and add:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_url
```

Run the backend server:
```sh
npm start
```

---

### **3️⃣ Frontend Setup**
```sh
cd front
npm install
npm start
```

---

## 🌐 API Endpoints

### **Appointments**
- `GET /appointments` → Get all appointments
- `POST /appointments` → Create a new appointment
- `PUT /appointments/:id` → Update an appointment
- `DELETE /appointments/:id` → Delete an appointment

### **Doctors**
- `GET /doctors` → Get all doctors
- `GET /doctors/:id/slots` → Get available slots for a doctor

---

## 🔥 Deployment
- **Frontend:** [https://slots-kr12.vercel.app](https://slots-kr12.vercel.app)
- **Backend:** Hosted on Render

---

## 🛑 Issues & Troubleshooting
1. **MongoDB Authentication Error?**
   - Ensure your MongoDB **username & password** are correct in `.env`.
   - Add **your Render IP** to MongoDB Atlas whitelist.

2. **Frontend Cannot Fetch Backend?**
   - Check if `CORS` is set properly (`origin: "*"` or specific domain).
   - Ensure **Render backend URL** is used in React (`axios.get("https://your-backend.onrender.com")`).

3. **Direct Pages Not Found on Vercel?**
   - Add a `vercel.json` file with:
     ```json
     {
       "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
     }
     ```

---


