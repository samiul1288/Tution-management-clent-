import { useEffect, useMemo, useState } from "react";
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

/**
 * ✅ Stripe key safe guard
 * If publishable key is missing, stripePromise will be null (no crash).
 */
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

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

  const amount = useMemo(() => {
    // state?.expectedSalary could be string -> normalize to number
    const v = state?.expectedSalary;
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }, [state]);

  // ✅ If no state (route was opened directly)
  if (!state) {
    return (
      <div className="max-w-md mx-auto my-10">
        <div className="alert alert-error">
          <span>
            No payment data found. Please go from Applied Tutors page.
          </span>
        </div>
      </div>
    );
  }

  // ✅ If amount invalid
  if (!amount || amount <= 0) {
    return (
      <div className="max-w-md mx-auto my-10">
        <div className="alert alert-error">
          <span>Invalid amount. Expected salary is missing.</span>
        </div>
      </div>
    );
  }

  // ✅ create payment intent
  useEffect(() => {
    let alive = true;

    const createIntent = async () => {
      try {
        setError("");
        setClientSecret("");

        const res = await axiosSecure.post("/payments/create-intent", {
          amount, // number
        });

        const secret = res?.data?.clientSecret;
        if (!secret)
          throw new Error("clientSecret missing from server response");

        if (alive) setClientSecret(secret);
      } catch (err) {
        console.error(err);
        if (alive)
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to initialize payment."
          );
      }
    };

    createIntent();

    return () => {
      alive = false;
    };
  }, [amount, axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!stripe || !elements) {
      setError("Stripe is not ready yet. Please wait a moment.");
      return;
    }
    if (!clientSecret) {
      setError("Payment initialization not completed. Please refresh.");
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setError("Card input not found.");
      return;
    }

    setProcessing(true);

    try {
      // 1) Create payment method
      const { error: pmError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card,
          billing_details: {
            name: user?.name || user?.displayName || "Student",
            email: user?.email || undefined,
          },
        });

      if (pmError) {
        setError(pmError.message || "Payment method creation failed.");
        return;
      }

      // 2) Confirm payment
      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });

      if (confirmError) {
        setError(confirmError.message || "Payment confirmation failed.");
        return;
      }

      // 3) Save to backend + approve application
      if (paymentIntent?.status === "succeeded") {
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
        }, 1200);
      } else {
        setError("Payment not completed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong, please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 card bg-base-100 border border-base-200 p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-2 text-center">
        Checkout – Approve Tutor
      </h2>

      <p className="text-xs text-gray-500 text-center mb-4">
        Tuition: <span className="font-semibold">{state.tuitionTitle}</span>
        <br />
        Tutor: <span className="font-semibold">{state.tutorName}</span>
      </p>

      <div className="mb-5 text-center">
        <p className="text-sm opacity-70">Amount to pay</p>
        <p className="text-2xl font-extrabold">{amount}৳</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 rounded-xl border border-base-300 bg-base-200">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "14px",
                  color: "#111827",
                  "::placeholder": { color: "#9CA3AF" },
                },
                invalid: { color: "#DC2626" },
              },
            }}
          />
        </div>

        {error ? (
          <div className="alert alert-error py-2">
            <span className="text-xs">{error}</span>
          </div>
        ) : null}

        {success ? (
          <div className="alert alert-success py-2">
            <span className="text-xs">{success}</span>
          </div>
        ) : null}

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={!stripe || !clientSecret || processing}
        >
          {processing ? (
            <span className="loading loading-spinner loading-xs" />
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
  // ✅ Show friendly message instead of crashing when key missing
  if (!stripePromise) {
    return (
      <div className="max-w-md mx-auto my-10">
        <div className="alert alert-error">
          <span>
            Stripe publishable key missing. Set{" "}
            <b>VITE_STRIPE_PUBLISHABLE_KEY</b> in your client .env and restart
            Vite.
          </span>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
