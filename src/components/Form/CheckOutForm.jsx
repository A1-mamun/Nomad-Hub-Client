import PropTypes from "prop-types";
import "./CheckOutForm.css";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { ImSpinner6 } from "react-icons/im";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CheckOutForm = ({ closeModal, bookingInfo, refetch }) => {
  const navigate = useNavigate();
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

    // handle error
    if (confirmError) {
      console.log("[confirmError]", confirmError);
      setCardError(confirmError.message);
      setProcessing(false);
      return;
    }

    // payment succeed
    if (paymentIntent.status === "succeeded") {
      // create payment info object
      console.log(paymentIntent);
      const paymentInfo = {
        ...bookingInfo,
        roomId: bookingInfo._id,
        transactionId: paymentIntent.id,
        date: new Date(),
      };
      delete paymentInfo._id;
      // save payment info to the database
      try {
        await axiosSecure.post("/booking", paymentInfo);
        refetch();
        setProcessing(false);
        closeModal();
        toast.success("Payment & Booking successful");
        navigate("/dashboard/my-bookings");
      } catch (err) {
        toast.error(err.message);
        setProcessing(false);
        console.log(err.message);
      }
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
        {cardError && <p className="text-red-500">{cardError}</p>}
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
            onClick={handleSubmit}
          >
            {processing ? (
              <ImSpinner6 className="animate-spin mx-auto" />
            ) : (
              `Pay ${bookingInfo.price}`
            )}
          </button>
        </div>
      </form>
    </>
  );
};

CheckOutForm.propTypes = {
  closeModal: PropTypes.func,
  bookingInfo: PropTypes.object,
  refetch: PropTypes.func,
};

export default CheckOutForm;
