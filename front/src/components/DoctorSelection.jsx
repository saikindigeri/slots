const DoctorSelection = ({ doctors, setSelectedDoctor }) => {
  return (
    <div className="mt-6 p-6 border border-gray-300 rounded-lg bg-white shadow-lg max-w-2xl mx-auto animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Select a Doctor</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {doctors.map((doc) => (
          <button
            key={doc._id}
            className="p-4 rounded-lg text-white font-semibold transition duration-300 bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 shadow-md"
            onClick={() => setSelectedDoctor(doc._id)}
          >
            {doc.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DoctorSelection;
