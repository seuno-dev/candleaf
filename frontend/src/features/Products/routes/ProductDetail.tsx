import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductImage } from "../types";
import useAddCartItem from "../../Cart/hooks/useAddCartItem";
import useProduct from "../hooks/useProduct";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { formatCurrency } from "../../../utils/currency";

function ProductDetail() {
  const { mutate, isSuccess, isError } = useAddCartItem();
  const { slug } = useParams();
  const { data: product, error } = useProduct(slug || "");

  const [showCartSuccessAlert, setShowCartSuccessAlert] = useState(false);
  const [showCartFailedAlert, setShowCartFailedAlert] = useState(false);

  const [selectedImage, setSelectedImage] = useState<ProductImage | undefined>(
    undefined
  );

  useEffect(() => {
    if (product) {
      setSelectedImage(
        product.images.length > 0 ? product.images[0] : undefined
      );
    }
  }, [product]);

  const showAlertTemporarily = (setShowAlert: (show: boolean) => void) => {
    setShowAlert(true);
    const timer = setTimeout(() => {
      setShowAlert(false);
      clearTimeout(timer);
    }, 3000);
  };

  useEffect(() => {
    if (isSuccess) {
      showAlertTemporarily(setShowCartSuccessAlert);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      showAlertTemporarily(setShowCartFailedAlert);
    }
  }, [isError]);

  if (error) throw error;

  if (!product) return <></>;

  const onAddToCart = () => {
    mutate({ productId: product.id, quantity: 1 });
  };

  return (
    <Box>
      <Container maxW="container.xl" pt="20px" pb="140px">
        <Stack direction={{ base: "column", lg: "row" }} spacing="22px">
          <VStack w={{ base: "full", lg: "500px" }}>
            <Heading fontWeight="medium" hideFrom="lg">
              {product.title}
            </Heading>
            <Image
              src={product.images[0].image}
              alt={"Image of " + product.title}
            />
            <Text
              textAlign="center"
              fontSize="xl"
              fontWeight="medium"
              hideBelow="lg"
            >
              All hand-made with natural soy wax, Candleaf is made for your
              pleasure moments.
              <br />
              <br />
              🚚 FREE SHIPPING
            </Text>
          </VStack>
          <VStack alignItems="start" spacing="22px">
            <Heading fontWeight="medium" hideBelow="lg">
              {product.title}
            </Heading>
            <HStack w="full" justifyContent="space-between">
              <Text color="primary" fontSize="2xl" fontWeight="semibold">
                {formatCurrency(product.unitPrice)}
              </Text>
              <Button>Add to cart</Button>
            </HStack>
            <Text>{product.description}</Text>
            <VStack
              w="full"
              p="22px"
              alignItems="start"
              borderWidth={1}
              borderColor="gray"
              borderRadius="md"
            >
              {[
                { key: "Wax", value: product.wax },
                { key: "Fragrance", value: product.fragrance },
                { key: "Burning Time", value: product.burningTime + " hours" },
                { key: "Dimension", value: product.dimension },
                { key: "Weight", value: product.weight + "g" },
              ].map(({ key, value }) => (
                <Text key={key} color="#849A8E" display="inline">
                  <Text color="#1D252C" display="inline">
                    {key}:{" "}
                  </Text>
                  {value}
                </Text>
              ))}
            </VStack>
            <Text
              textAlign="center"
              fontSize="2xl"
              fontWeight="semibold"
              hideFrom="lg"
            >
              All hand-made with natural soy wax, Candleaf is made for your
              pleasure moments.
              <br />
              <br />
              🚚 FREE SHIPPING
            </Text>
          </VStack>
        </Stack>
      </Container>
    </Box>
  );
}

export default ProductDetail;
