import { Link } from "react-router-dom";
import Header from "./Header";
import doctorsImage from "../assets/doctors.jpg"; // Importing the image

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Main Content */}
      <div className="flex-grow px-6 py-12 bg-gradient-to-r from-blue-100 to-blue-50">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            Your Health, Your Schedule
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Book appointments with top doctors effortlessly. Get expert medical advice, 
            routine check-ups, and consultations without waiting in long queues.
          </p>

          {/* Embedded Image */}
          <div className="w-full h-64 md:h-auto flex items-center justify-center mb-8">
            <img 
              src={doctorsImage} 
              alt="Doctors consultation" 
              className="w-full h-full md:h-auto object-contain rounded-lg shadow-lg"
            />
          </div>

          {/* Why Choose Us Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-gray-800 text-lg font-medium">
            <div className="p-4 rounded-lg bg-white shadow-md">
              ✅ Experienced & Verified Doctors
            </div>
            <div className="p-4 rounded-lg bg-white shadow-md">
              ✅ Instant Appointment Booking
            </div>
            <div className="p-4 rounded-lg bg-white shadow-md">
              ✅ Secure & Private Consultations
            </div>
            <div className="p-4 rounded-lg bg-white shadow-md">
              ✅ Flexible Scheduling & Reminders
            </div>
          </div>

          {/* Call to Action Button */}
          <Link
            to="/doctors"
            className="mt-8 inline-block bg-gradient-to-r from-purple-500 to-blue-00 text-red px-10 py-4 rounded-sm text-xl font-semibold shadow-lg hover:from-purple-600 hover:to-blue-600 hover:scale-105 transition-transform"
          >
            Book an Appointment 
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center text-sm">
        &copy; {new Date().getFullYear()} Prenatal Care. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
