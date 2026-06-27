import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  DollarSign,
  Heart,
  X,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const CARD_STYLE = {
  style: {
    base: {
      fontSize: "15px",
      color: "#1f2937",
      fontFamily: "inherit",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#ef4444" },
  },
};

// Payment form inside modal
const PaymentForm = ({ onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!stripe || !elements) return;

    setProcessing(true);
    try {
      // get client secret
      const { data } = await axiosSecure.post("/create-payment-intent", {
        price: parsedAmount,
      });

      const cardElement = elements.getElement(CardElement);

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: user?.displayName || user?.email,
              email: user?.email,
            },
          },
        }
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // save to DB
        await axiosSecure.post("/fundings", {
          amount: parsedAmount,
          transactionId: paymentIntent.id,
        });

        toast.success("Thank you for your generous donation! 🎉");
        onSuccess();
      }
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const quickAmounts = [5, 10, 25, 50];

  return (
    <form onSubmit={handlePay} className="space-y-5">

      {/* Quick amount buttons */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
          Quick Select
        </label>
        <div className="grid grid-cols-4 gap-2">
          {quickAmounts.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setAmount(String(q))}
              className={`py-2 rounded-xl text-sm font-semibold border transition-all ${
                amount === String(q)
                  ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-200"
                  : "border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-500"
              }`}
            >
              ${q}
            </button>
          ))}
        </div>
      </div>

      {/* Custom amount */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
          Custom Amount (USD)
        </label>
        <div className="relative">
          <DollarSign
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="number"
            min="1"
            step="0.01"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
            required
          />
        </div>
      </div>

      {/* Card element */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
          Card Details
        </label>
        <div className="p-4 rounded-xl border border-gray-200 focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-100 transition-all bg-white">
          <CardElement options={CARD_STYLE} />
        </div>
        <p className="text-xs text-gray-400 mt-1.5 ml-1">
          Test card: 4242 4242 4242 4242 — any future date, any CVC
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onClose}
          disabled={processing}
          className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing || !amount}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white font-semibold shadow-md shadow-red-200 hover:shadow-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Heart size={16} />
          )}
          {processing ? "Processing..." : `Donate${amount ? ` $${amount}` : ""}`}
        </button>
      </div>
    </form>
  );
};

// Main Funding page
const Funding = () => {
  const axiosSecure = useAxiosSecure();

  const [fundings, setFundings] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  const fetchFundings = async () => {
    try {
      const res = await axiosSecure.get(
        `/fundings?page=${page}&limit=${limit}`
      );
      setFundings(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error("Failed to load fundings");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchFundings();
  }, [page]);

  const handleSuccess = () => {
    setShowModal(false);
    setPage(1);
    fetchFundings();
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (pageLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 rounded-3xl p-8 text-white shadow-xl shadow-red-200">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1 uppercase tracking-widest">
                Support Us
              </p>
              <h1 className="text-3xl font-extrabold">Funding</h1>
              <p className="text-white/80 mt-1 text-sm">
                Your contribution helps us save more lives every day.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-red-600 font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shrink-0"
            >
              <Heart size={17} />
              Give Fund
            </button>
          </div>
          <DollarSign size={120} className="absolute -right-6 -top-6 text-white/10" />
        </div>

        {/* Funding table */}
        <div className="bg-white rounded-3xl shadow-lg border border-red-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-50">
              <DollarSign size={18} className="text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">
              All Contributions
            </h2>
            <span className="ml-auto text-xs text-gray-400 font-medium">
              Page {page} of {totalPages}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th>#</th>
                  <th>Donor Name</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {fundings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-gray-400">
                      No fundings yet. Be the first to contribute!
                    </td>
                  </tr>
                ) : (
                  fundings.map((f, index) => (
                    <tr
                      key={f._id}
                      className="hover:bg-rose-50/30 transition-colors"
                    >
                      <td className="text-gray-400 text-sm">
                        {(page - 1) * limit + index + 1}
                      </td>

                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                            <User size={14} className="text-red-500" />
                          </div>
                          <span className="font-semibold text-gray-800 text-sm">
                            {f.name}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-green-50 text-green-700 font-bold text-sm border border-green-200">
                          <DollarSign size={12} />
                          {f.amount}
                        </span>
                      </td>

                      <td>
                        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                          <Calendar size={13} className="text-rose-400" />
                          {formatDate(f.fundingDate)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-5 border-t border-gray-100 flex justify-center items-center gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-2 rounded-xl border border-gray-200 hover:border-red-400 hover:text-red-500 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={17} />
              </button>

              {[...Array(totalPages).keys()].map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p + 1)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                    page === p + 1
                      ? "bg-red-600 text-white shadow-md shadow-red-200"
                      : "border border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-500"
                  }`}
                >
                  {p + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 rounded-xl border border-gray-200 hover:border-red-400 hover:text-red-500 disabled:opacity-40 transition-colors"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Payment modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full space-y-5">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-100">
                  <Heart size={20} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Make a Donation
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <Elements stripe={stripePromise}>
              <PaymentForm
                onSuccess={handleSuccess}
                onClose={() => setShowModal(false)}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default Funding;