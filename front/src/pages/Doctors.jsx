import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/doctors")
      .then((res) => setDoctors(res.data))
     
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);



  return (
    <div className="container mx-auto p-4">
         <ToastContainer className="mt-4" position="top-right" autoClose={3000} hideProgressBar />
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Select a Doctor</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {doctors.map((doc) => (
          <Link 
            key={doc._id} 
            to={`/doctors/${doc._id}`} 
            className="p-4 bg-teal-100 text-gray-800 rounded-lg shadow-md transition transform hover:scale-105 hover:bg-teal-200 flex flex-col items-center text-center"
          >
            <span className="text-lg font-medium">{doc.name}</span>
            {doc.specialization && (
              <span className="text-xs text-gray-600 mt-1">{doc.specialization}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DoctorsPage;
