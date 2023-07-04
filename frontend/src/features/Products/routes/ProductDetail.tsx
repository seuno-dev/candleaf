import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductImage } from "../types";
import useAddCartItem from "../../Cart/hooks/useAddCartItem";
import useProduct from "../hooks/useProduct";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container, Divider,
  Fade,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { formatCurrency } from "../../../utils/currency";
import { getAuthenticationStatus } from "../../../api";
import ProductReview from "../components/ProductReview";

function ProductDetail() {
  const { mutate, isSuccess, isError } = useAddCartItem();
  const { slug } = useParams();
  const { data: product, error } = useProduct(slug || "");

  const [showCartSuccessAlert, setShowCartSuccessAlert] = useState(false);
  const [showCartFailedAlert, setShowCartFailedAlert] = useState(false);

  const [selectedImage, setSelectedImage] = useState<ProductImage | undefined>(
    undefined
  );

  const [moreReviews, setMoreReviews] = useState(false);
  const productReviews = product && product.reviews.length > 3 && !moreReviews ? product.reviews.slice(0,3) : product?.reviews ;

  const navigate = useNavigate();

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
    if (getAuthenticationStatus())
      mutate({ productId: product.id, quantity: 1 });
    else navigate("/auth/login");
  };

  return (
    <Box>
      <Box w="full" position="absolute">
        <Fade in={showCartSuccessAlert}>
          <Alert maxW="300px" mx="auto" status="success" rounded="lg">
            <AlertTitle>Added to cart successfully.</AlertTitle>
          </Alert>
        </Fade>
      </Box>
      <Box w="full" position="absolute">
        <Fade in={showCartFailedAlert}>
          <Alert maxW="300px" mx="auto" status="error" rounded="lg">
            <AlertTitle textAlign="center">Failed adding to cart.</AlertTitle>
          </Alert>
        </Fade>
      </Box>
      <Container maxW="container.xl" pt="20px" pb="140px">
        <Stack direction={{ base: "column", lg: "row" }} spacing="22px">
          <VStack w={{ base: "full", lg: "500px" }}>
            <Heading fontWeight="medium" hideFrom="lg">
              {product.title}
            </Heading>
            <Image
              w="350px"
              h="350px"
              objectFit="cover"
              src={selectedImage ? selectedImage.image : "logo512.png"}
              alt={"Image of " + product.title}
            />
            <HStack overflowX="auto" alignSelf={"start"}>
              {product.images.map((image) => (
                <Image
                  key={image.id}
                  w="80px"
                  src={image.image}
                  onPointerEnter={() => setSelectedImage(image)}
                  alt={`Image of product ${product.title}`}
                />
              ))}
            </HStack>
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
              <Button onClick={onAddToCart}>Add to cart</Button>
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
            {product.reviews.length > 0 &&
              <Box my="20px">
                <Text as="b" fontSize="xl">Reviews</Text>
                <Stack divider={<Divider />}>
                  {productReviews?.map(review =>
                    <ProductReview key={review.id} review={review}/>
                  )}
                </Stack>
                {product.reviews.length > 3 &&
                  <Button variant="link" onClick={()=>setMoreReviews(!moreReviews)}>{moreReviews ? "See Less": "See More"}</Button>}
              </Box>}
          </VStack>
        </Stack>
      </Container>
    </Box>
  );
}

export default ProductDetail;
