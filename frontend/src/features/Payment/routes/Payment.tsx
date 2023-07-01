import React, { useEffect, useState } from "react";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useLocation } from "react-router-dom";
import PaymentForm from "../components/PaymentForm";
import useCreatePayment from "../hooks/useCreatePayment";
import { Box, Container, HStack, Stack, Text } from "@chakra-ui/react";
import { formatCurrency } from "../../../utils/currency";
import useOrder from "../../Order/hooks/useOrder";

const PUBLIC_KEY =
  "pk_test_51MrXJqJbct4h59axLQlhHiD8RC63zMCy6pcJPMrF6bs0vR2sLJBPWT183v5M5IxrbSK6cvuGiWudi8Cb3HAFkqJE00ohaMxyd4";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

export default function Payment() {
  const { state } = useLocation();
  const { orderId } = state;
  const { data: clientSecret } = useCreatePayment(orderId);
  const { data: order } = useOrder(orderId);
  const [options, setOptions] = useState<StripeElementsOptions | null>(null);

  useEffect(() => {
    setOptions({
      clientSecret,
    });
  }, [clientSecret]);

  return (
    <Stack direction={{ base: "column", md: "row" }}>
      <Box bgColor="#F2F2F2">
        <Container maxW="container.xl" py="20px">
          <HStack justifyContent="space-between">
            <Text color="primary">See your order details</Text>
            <Text fontWeight="medium">
              {formatCurrency(order?.totalPrice || 0)}
            </Text>
          </HStack>
        </Container>
      </Box>
      <Container maxW="container.xl" pt="20px" pb="40px">
        {options && options.clientSecret && (
          <Elements stripe={stripeTestPromise} options={options}>
            <PaymentElement />
            <Box mt="20px">
              <PaymentForm clientSecret={options.clientSecret} />
            </Box>
          </Elements>
        )}
      </Container>
    </Stack>
  );
}
