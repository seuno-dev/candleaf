import React from "react";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { Button } from "@material-tailwind/react";

type PaymentFormProps = {
  clientSecret: string;
};

function PaymentForm({ clientSecret }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const elementError = await elements.submit();

    if (elementError.error) {
      console.log(elementError.error);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: "http://127.0.0.1:3000/payment/success",
      },
    });

    if (error) {
      console.log(error);
      return;
    }
  };

  return (
    <>
      <form>
        <Button onClick={handleSubmit}>Submit</Button>
      </form>
    </>
  );
}

export default PaymentForm;
