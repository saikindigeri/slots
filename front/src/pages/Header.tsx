import { useState } from "react";
import { Menu, X } from "lucide-react"; // Import icons for menu toggle

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white/30 backdrop-blur-lg shadow-lg p-4 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-blue-600">
          <a href="/">Prenatal Care</a>
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="px-4 py-2 rounded-lg text-gray-800 hover:bg-blue-500 hover:text-white transition">
            Home
          </a>
         
          <a href="/doctors" className="px-4 py-2 rounded-lg text-gray-800 hover:bg-blue-500 hover:text-white transition">
            Doctors
          </a>
          <a href="/appointments" className="px-4 py-2 rounded-lg text-gray-800 hover:bg-blue-500 hover:text-white transition">
            Appointments
          </a>
          
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-800" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden flex flex-col items-center bg-white/80 backdrop-blur-lg absolute top-16 left-0 w-full shadow-lg p-4">
          <a href="/" className="block w-full text-center py-2 text-gray-800 hover:bg-blue-500 hover:text-white transition">
            Home
          </a>
          <a href="/appointments" className="block w-full text-center py-2 text-gray-800 hover:bg-blue-500 hover:text-white transition">
            Appointments
          </a>
          <a href="/doctors" className="block w-full text-center py-2 text-gray-800 hover:bg-blue-500 hover:text-white transition">
            Doctors
          </a>
          <a href="/slots" className="block w-full text-center py-2 text-gray-800 hover:bg-blue-500 hover:text-white transition">
            Slots
          </a>
        </nav>
      )}
    </header>
  );
};

export default Header;
