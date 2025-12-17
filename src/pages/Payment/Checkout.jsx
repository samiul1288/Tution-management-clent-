import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// ---------- inner form component ----------

const CheckoutForm = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const amount = state?.expectedSalary;

  useEffect(() => {
    if (!amount) return;
    const createIntent = async () => {
      try {
        const res = await axiosSecure.post("/payments/create-intent", {
          amount,
        });
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.error(err);
        setError("Failed to initialize payment.");
      }
    };
    createIntent();
  }, [amount, axiosSecure]);

  if (!state) {
    return <p className="text-center mt-10">No payment data found.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setProcessing(true);
    try {
      const { error: pmError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card,
          billing_details: {
            name: user?.name || user?.displayName || "Student",
            email: user?.email,
          },
        });

      if (pmError) {
        console.error(pmError);
        setError(pmError.message || "Payment failed.");
        setProcessing(false);
        return;
      }

      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });

      if (confirmError) {
        console.error(confirmError);
        setError(confirmError.message || "Payment confirmation failed.");
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // save to backend + approve application
        const payload = {
          transactionId: paymentIntent.id,
          applicationId: state.applicationId,
          tuitionId: state.tuitionId,
          tutorId: state.tutorId,
          amount,
        };

        await axiosSecure.post("/payments/confirm", payload);

        setSuccess("Payment successful! Tutor has been approved.");
        setTimeout(() => {
          navigate("/dashboard/student/payments");
        }, 1800);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong, please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 card bg-base-100 p-6 shadow">
      <h2 className="text-xl font-bold mb-2 text-center">
        Checkout – Approve Tutor
      </h2>
      <p className="text-xs text-gray-500 text-center mb-4">
        Tuition: <span className="font-semibold">{state.tuitionTitle}</span>
        <br />
        Tutor: <span className="font-semibold">{state.tutorName}</span>
      </p>

      <div className="mb-4 text-center">
        <p className="text-sm">Amount to pay</p>
        <p className="text-2xl font-extrabold">{amount}৳</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 rounded-lg border border-base-300 bg-base-200">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "14px",
                  color: "#444",
                  "::placeholder": { color: "#a0aec0" },
                },
                invalid: { color: "#e53e3e" },
              },
            }}
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
        {success && <p className="text-xs text-green-500">{success}</p>}

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={!stripe || !clientSecret || processing}
        >
          {processing ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            "Pay & Confirm Tutor"
          )}
        </button>
      </form>

      <p className="text-[11px] text-gray-500 text-center mt-3">
        Payments are processed securely with Stripe. We don&apos;t store your
        card details.
      </p>
    </div>
  );
};

// ---------- wrapper exported to router ----------

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
