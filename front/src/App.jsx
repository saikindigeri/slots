

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
