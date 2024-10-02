import PropTypes from "prop-types";
import "./CheckOutForm.css";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CheckOutForm = ({ closeModal, bookingInfo }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const [clientSecret, setClientSecret] = useState();
  const [cardError, setCardError] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // fetch client secret from the server
    if (bookingInfo?.price && bookingInfo?.price > 0) {
      getClientSecret({ price: bookingInfo.price });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingInfo?.price]);

  // get client secret
  const getClientSecret = async (price) => {
    const { data } = await axiosSecure.post("/create-payment-intent", price);
    setClientSecret(data.clientSecret);
  };

  console.log("clientSecret", clientSecret);
  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    setProcessing(true);
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("[error]", error);
      setCardError(error.message);
      setProcessing(false);
      return;
    } else {
      console.log("[PaymentMethod]", paymentMethod);
      setCardError("");
    }
    // Confirm payment
    const { error: confirmError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: bookingInfo.guest.email,
            name: bookingInfo.guest.name,
          },
        },
      });
    if (confirmError) {
      console.log("[confirmError]", confirmError);
      setCardError(confirmError.message);
      setProcessing(false);
      return;
    }

    // payment succeed

    if (paymentIntent.status === "succeeded") {
      setProcessing(false);
      alert("Payment succeeded");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />

        <div className="flex mt-2 justify-around">
          <button
            onClick={closeModal}
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            Cancel
          </button>
          <button
            disabled={!stripe || !clientSecret || processing}
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
            onClick={closeModal}
          >
            Pay ${bookingInfo.price}
          </button>
        </div>
      </form>
      {cardError && <p className="text-red-500">{cardError}</p>}
    </>
  );
};

CheckOutForm.propTypes = {
  closeModal: PropTypes.func,
  bookingInfo: PropTypes.object,
};

export default CheckOutForm;
