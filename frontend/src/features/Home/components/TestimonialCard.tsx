import React from "react";
import { Card, CardBody, HStack, Image, Text, VStack } from "@chakra-ui/react";
import Star from "../../../assets/images/testimonial-star.png";

export interface TestimonialCardProps {
  image: string;
  review: string;
  name: string;
}

const TestimonialCard = ({ image, review, name }: TestimonialCardProps) => {
  return (
    <Card
      maxW={{ base: "290px", lg: "350px" }}
      h={{ base: "270px", lg: "320px" }}
    >
      <CardBody p={{ base: "8px", lg: "30px" }}>
        <VStack justifyContent="center" alignItems="center" textAlign="center">
          <Image boxSize="84px" src={image} alt={name + "'s image"} />
          <HStack>
            {[0, 1, 2, 3, 4].map((i) => (
              <Image key={i} src={Star} alt="Star" boxSize="24px" />
            ))}
          </HStack>
          <Text
            fontSize="22px"
            mt={{ base: "8px", lg: "22px" }}
            fontWeight="medium"
          >
            {review}
          </Text>
          <Text fontSize="18px" color="#7C8087" fontFamily="subheading">
            {name}
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default TestimonialCard;
