import React, { useEffect, useState } from "react";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useLocation } from "react-router-dom";
import PaymentForm from "../components/PaymentForm";
import useCreatePayment from "../hooks/useCreatePayment";
import {
  Box,
  calc,
  Container,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { formatCurrency } from "../../../utils/currency";
import useOrder from "../../Order/hooks/useOrder";
import OrderItemRow from "../components/OrderItemRow";
import CreditCardIcon from "../../../assets/images/credit-card.svg";

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
    <Stack minH="100vh" direction={{ base: "column", md: "row-reverse" }}>
      <Box bgColor="#F2F2F2" w={{ base: "full", md: "50wv" }}>
        <Container
          maxW={{
            base: "container.xl",
            md: calc("var(--chakra-sizes-container-xl)").divide(2).toString(),
          }}
          ml={{
            md: 0,
          }}
          pl={{
            md: "100px",
          }}
          py="60px"
        >
          {order && (
            <VStack spacing="20px">
              {order.items.map((item) => (
                <OrderItemRow key={item.id} orderItem={item} />
              ))}
              <HStack
                w="full"
                mt="50px"
                pt="20px"
                borderColor="#e5e5e5"
                borderTopWidth="1px"
                justifyContent="space-between"
                fontFamily="subheading"
              >
                <Text>Subtotal</Text>
                <Text fontWeight="semibold">
                  {formatCurrency(order.totalPrice)}
                </Text>
              </HStack>
              <HStack
                w="full"
                pb="20px"
                justifyContent="space-between"
                fontFamily="subheading"
              >
                <Text>Shipping</Text>
                <Text fontWeight="semibold">Free Shipping</Text>
              </HStack>
              <HStack
                w="full"
                pt="20px"
                borderTopWidth="1px"
                borderColor="#e5e5e5"
                justifyContent="space-between"
                fontFamily="subheading"
              >
                <Text>Total</Text>
                <Text fontWeight="semibold" fontSize="3xl">
                  {formatCurrency(order.totalPrice)}
                </Text>
              </HStack>
            </VStack>
          )}
          <HStack justifyContent="space-between" hideFrom="md">
            <Text color="primary">See your order details</Text>
            <Text fontWeight="medium">
              {formatCurrency(order?.totalPrice || 0)}
            </Text>
          </HStack>
        </Container>
      </Box>
      <Box w={{ base: "full", md: "50wv" }}>
        <Container
          maxW={{
            base: "container.xl",
            md: calc("var(--chakra-sizes-container-xl)").divide(2).toString(),
          }}
          mr={{
            md: 0,
          }}
          pr={{
            md: "100px",
          }}
          py="60px"
        >
          {options && options.clientSecret && (
            <Elements stripe={stripeTestPromise} options={options}>
              <Heading fontSize="lg" fontWeight="medium">
                Payment method
              </Heading>
              <HStack
                w="full"
                mt="23px"
                py="14px"
                px="21px"
                bgColor="#c0e2cf"
                borderTopRadius="lg"
              >
                <Image src={CreditCardIcon} alt="Credit card icon" />
                <Text ml="20px" color="primary">
                  Credit Card
                </Text>
              </HStack>
              <Box borderColor="#e5e5e5" borderWidth="1px" p="21px">
                <PaymentElement />
              </Box>
              <Box mt="20px">
                <PaymentForm clientSecret={options.clientSecret} />
              </Box>
            </Elements>
          )}
        </Container>
      </Box>
    </Stack>
  );
}
