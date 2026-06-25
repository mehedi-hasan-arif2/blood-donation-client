import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useAxiosSecure from "../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const FundingForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { clientSecret } = (await axiosSecure.post("/create-payment-intent", { price: 20 })).data;
    const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    });
    if (paymentIntent.status === "succeeded") {
      await axiosSecure.post("/fundings", { amount: 20, transactionId: paymentIntent.id });
      toast.success("Funding Successful!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow rounded-xl">
      <CardElement className="p-4 border rounded mb-4" />
      <button className="btn btn-success w-full" disabled={!stripe}>Pay $20</button>
    </form>
  );
};

const Funding = () => (
  <Elements stripe={stripePromise}>
    <FundingForm />
  </Elements>
);
export default Funding;