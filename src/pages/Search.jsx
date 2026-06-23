import { Search as SearchIcon, Droplets, MapPin, Users } from "lucide-react";

const Search = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-md mb-5">
            <Droplets size={18} />
            Find Blood Donors Near You
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-5">
            Search Blood Donors
          </h1>

          <p className="max-w-2xl mx-auto text-white/90">
            Find verified blood donors quickly by selecting blood group,
            district and upazila.
          </p>

        </div>
      </section>

      {/* SEARCH FORM */}
      <section className="max-w-6xl mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* BLOOD GROUP */}
            <select
              className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="">Select Blood Group</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>

            {/* DISTRICT */}
            <select
              className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="">Select District</option>
            </select>

            {/* UPAZILA */}
            <select
              className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="">Select Upazila</option>
            </select>

            {/* BUTTON */}
            <button
              className="bg-gradient-to-r from-red-600 via-rose-500 to-pink-500
              text-white rounded-xl font-semibold px-6 py-3
              hover:scale-[1.02] transition duration-300 shadow-lg
              flex items-center justify-center gap-2"
            >
              <SearchIcon size={18} />
              Search
            </button>

          </div>
        </div>
      </section>

      {/* RESULTS SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-20">

        <div className="text-center mb-10">

          <h2 className="text-3xl font-bold text-gray-800">
            Search Results
          </h2>

          <p className="text-gray-500 mt-2">
            Donors matching your search will appear here.
          </p>

        </div>

        {/* EMPTY STATE */}
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center">

          <div className="flex justify-center mb-5">
            <div className="bg-red-100 p-5 rounded-full">
              <Users className="text-red-500" size={40} />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            No Search Performed Yet
          </h3>

          <p className="text-gray-500 max-w-md mx-auto">
            Select blood group, district and upazila then click search
            to find available donors.
          </p>

        </div>

      </section>

      {/* INFO CARDS */}
      <section className="max-w-6xl mx-auto px-4 pb-20">

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <Droplets className="mx-auto text-red-500 mb-3" size={35} />
            <h3 className="font-bold text-lg">Verified Donors</h3>
            <p className="text-gray-500 text-sm mt-2">
              Search active blood donors from different locations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <MapPin className="mx-auto text-red-500 mb-3" size={35} />
            <h3 className="font-bold text-lg">Location Based</h3>
            <p className="text-gray-500 text-sm mt-2">
              Find donors by district and upazila.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <Users className="mx-auto text-red-500 mb-3" size={35} />
            <h3 className="font-bold text-lg">Quick Response</h3>
            <p className="text-gray-500 text-sm mt-2">
              Connect with donors faster during emergencies.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
};

export default Search;