import React from "react";
import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import Slider from "react-slick";

import TestimonialCard, { TestimonialCardProps } from "./TestimonialCard";
import TestimonialPhoto1 from "../../../assets/images/testimonial1.png";
import TestimonialPhoto2 from "../../../assets/images/testimonial2.png";
import TestimonialPhoto3 from "../../../assets/images/testimonial3.png";

const TestimonialSection = () => {
  const testimonials: TestimonialCardProps[] = [
    {
      image: TestimonialPhoto1,
      review: "“I love it! No more air fresheners”",
      name: "Luisa",
    },
    {
      image: TestimonialPhoto2,
      review: "“Recommended for everyone”",
      name: "Edoardo",
    },
    {
      image: TestimonialPhoto3,
      review: "“Looks very natural, the smell is awesome”",
      name: "Mart",
    },
  ];

  return (
    <Box w="full" pt="90px" pb="120px" bgColor="#EEF7F2">
      <Container maxW="container.xl">
        <VStack justifyContent="center" alignItems="center" textAlign="center">
          <Heading fontWeight="medium" color="black">
            Testimonials
          </Heading>
          <Text fontSize={18} color="#5E6E89" fontWeight="medium">
            Some quotes from our happy customers
          </Text>
        </VStack>
      </Container>
      <Box mt="50px">
        <Slider
          arrows={false}
          centerMode={true}
          slidesToShow={1}
          slidesToScroll={1}
          swipeToSlide={true}
          draggable={true}
          initialSlide={1}
          variableWidth={true}
          infinite={false}
        >
          {testimonials.map((testimonial, index) => (
            <Box key={index} mx={["0px", "10px", "25px"]}>
              <TestimonialCard key={index} {...testimonial} />
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default TestimonialSection;
