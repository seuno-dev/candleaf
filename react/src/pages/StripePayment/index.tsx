import React, { useEffect, useState } from "react";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useLocation } from "react-router-dom";
import { usePayment } from "./hooks";
import PaymentForm from "./PaymentForm";

const PUBLIC_KEY =
  "pk_test_51MrXJqJbct4h59axLQlhHiD8RC63zMCy6pcJPMrF6bs0vR2sLJBPWT183v5M5IxrbSK6cvuGiWudi8Cb3HAFkqJE00ohaMxyd4";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

export default function StripePayment() {
  const { state } = useLocation();
  const { orderId } = state;
  const [options, setOptions] = useState<StripeElementsOptions | null>(null);
  const { getClientSecret } = usePayment();

  useEffect(() => {
    getClientSecret(orderId).then((clientSecret) => {
      setOptions({
        clientSecret: clientSecret,
      });
    });
  }, []);

  return (
    <>
      {options && options.clientSecret && (
        <Elements stripe={stripeTestPromise} options={options}>
          <PaymentElement />
          <PaymentForm clientSecret={options.clientSecret} />
        </Elements>
      )}
    </>
  );
}
