import { Heart, MapPin, CalendarDays, Clock, Droplets } from "lucide-react";

const DonationRequests = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">

      {/* HERO */}
      <section className="bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-md mb-5">
            <Heart size={18} />
            Blood Donation Requests
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-5">
            Save A Life Today
          </h1>

          <p className="max-w-2xl mx-auto text-white/90">
            Explore active blood donation requests and help someone in
            need by becoming a donor.
          </p>

        </div>
      </section>

      {/* SECTION HEADER */}
      <section className="max-w-7xl mx-auto px-4 py-16">

        <div className="text-center mb-12">

          <h2 className="text-3xl font-bold text-gray-800">
            Pending Donation Requests
          </h2>

          <p className="text-gray-500 mt-2">
            Only pending blood requests will be displayed here.
          </p>

        </div>

        {/* SAMPLE CARDS */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {/* CARD 1 */}
          <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden">

            <div className="bg-gradient-to-r from-red-600 to-rose-500 p-5 text-white">

              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xl">
                  Rahim Uddin
                </h3>

                <span className="bg-white text-red-600 font-bold px-3 py-1 rounded-full text-sm">
                  A+
                </span>
              </div>

            </div>

            <div className="p-6 space-y-4">

              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={18} />
                <span>Dhaka, Dhanmondi</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <CalendarDays size={18} />
                <span>20 July 2026</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={18} />
                <span>10:30 AM</span>
              </div>

              <button
                className="w-full bg-gradient-to-r from-red-600 via-rose-500 to-pink-500
                text-white py-3 rounded-xl font-semibold
                hover:scale-[1.02] transition"
              >
                View Details
              </button>

            </div>

          </div>

          {/* CARD 2 */}
          <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden">

            <div className="bg-gradient-to-r from-red-600 to-rose-500 p-5 text-white">

              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xl">
                  Karim Ahmed
                </h3>

                <span className="bg-white text-red-600 font-bold px-3 py-1 rounded-full text-sm">
                  O-
                </span>
              </div>

            </div>

            <div className="p-6 space-y-4">

              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={18} />
                <span>Chattogram, Hathazari</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <CalendarDays size={18} />
                <span>24 July 2026</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={18} />
                <span>02:00 PM</span>
              </div>

              <button
                className="w-full bg-gradient-to-r from-red-600 via-rose-500 to-pink-500
                text-white py-3 rounded-xl font-semibold
                hover:scale-[1.02] transition"
              >
                View Details
              </button>

            </div>

          </div>

          {/* CARD 3 */}
          <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden">

            <div className="bg-gradient-to-r from-red-600 to-rose-500 p-5 text-white">

              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xl">
                  Nusrat Jahan
                </h3>

                <span className="bg-white text-red-600 font-bold px-3 py-1 rounded-full text-sm">
                  B+
                </span>
              </div>

            </div>

            <div className="p-6 space-y-4">

              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={18} />
                <span>Rajshahi, Boalia</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <CalendarDays size={18} />
                <span>28 July 2026</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={18} />
                <span>06:00 PM</span>
              </div>

              <button
                className="w-full bg-gradient-to-r from-red-600 via-rose-500 to-pink-500
                text-white py-3 rounded-xl font-semibold
                hover:scale-[1.02] transition"
              >
                View Details
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* EMPTY STATE */}
      <section className="max-w-4xl mx-auto px-4 pb-20">

        <div className="bg-white rounded-3xl shadow-lg p-12 text-center">

          <div className="flex justify-center mb-5">
            <div className="bg-red-100 p-5 rounded-full">
              <Droplets className="text-red-500" size={40} />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            No Requests Found
          </h3>

          <p className="text-gray-500">
            When there are no pending donation requests, this section
            will be displayed.
          </p>

        </div>

      </section>

    </div>
  );
};

export default DonationRequests;