import { HeartHandshake, DollarSign, HandCoins, Calendar } from "lucide-react";

const demoFunds = [
  {
    id: 1,
    name: "Mehedi Hasan",
    amount: 20,
    date: "2026-06-15",
  },
  {
    id: 2,
    name: "Sarah Ahmed",
    amount: 15,
    date: "2026-06-17",
  },
  {
    id: 3,
    name: "Rakib Hossain",
    amount: 30,
    date: "2026-06-19",
  },
];

const Funding = () => {
  const totalFunding = demoFunds.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-white">

      {/* HERO */}
      <section className="bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 text-white py-16 px-4">

        <div className="max-w-6xl mx-auto text-center">

          <div className="flex justify-center mb-5">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-md">
              <HeartHandshake size={40} />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Support Our Mission
          </h1>

          <p className="max-w-2xl mx-auto text-white/90">
            Your contribution helps us connect blood donors with patients
            in need and keep this platform running efficiently.
          </p>

        </div>

      </section>

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-red-100">

            <DollarSign
              size={40}
              className="mx-auto text-red-500 mb-3"
            />

            <h3 className="text-3xl font-bold text-gray-800">
              ${totalFunding}
            </h3>

            <p className="text-gray-500 mt-2">
              Total Funding
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-red-100">

            <HandCoins
              size={40}
              className="mx-auto text-red-500 mb-3"
            />

            <h3 className="text-3xl font-bold text-gray-800">
              {demoFunds.length}
            </h3>

            <p className="text-gray-500 mt-2">
              Total Contributors
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-red-100">

            <Calendar
              size={40}
              className="mx-auto text-red-500 mb-3"
            />

            <h3 className="text-3xl font-bold text-gray-800">
              2026
            </h3>

            <p className="text-gray-500 mt-2">
              Active Campaign
            </p>

          </div>

        </div>

      </section>

      {/* FUND BUTTON */}
      <section className="max-w-6xl mx-auto px-4">

        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 border border-red-100">

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Help Save More Lives
            </h2>

            <p className="text-gray-500 mt-2">
              Every contribution supports blood donation awareness
              and emergency response efforts.
            </p>
          </div>

          <button
            className="bg-gradient-to-r from-red-600 via-rose-500 to-pink-500
            text-white px-8 py-3 rounded-xl font-semibold
            hover:scale-105 hover:-translate-y-1 transition duration-300 shadow-lg"
          >
            Give Funding
          </button>

        </div>

      </section>

      {/* TABLE */}
      <section className="max-w-6xl mx-auto px-4 py-12">

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <div className="px-6 py-5 border-b">
            <h2 className="text-2xl font-bold text-gray-800">
              Recent Funding History
            </h2>
          </div>

          <div className="overflow-x-auto">

            <table className="table w-full">

              <thead className="bg-red-50">

                <tr>
                  <th>#</th>
                  <th>Donor Name</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>

              </thead>

              <tbody>

                {demoFunds.map((fund, index) => (
                  <tr key={fund.id} className="hover">

                    <td>{index + 1}</td>

                    <td>{fund.name}</td>

                    <td className="font-semibold text-green-600">
                      ${fund.amount}
                    </td>

                    <td>{fund.date}</td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Funding;