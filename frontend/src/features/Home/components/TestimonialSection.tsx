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
          slidesToShow={3}
          slidesToScroll={1}
          swipeToSlide={true}
          draggable={true}
          initialSlide={1}
          infinite={false}
          responsive={[
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
                centerMode: true
              },
            },
          ]}
        >
          {testimonials.map((testimonial, index) => (
            <Box key={index} px="20px">
              <TestimonialCard {...testimonial} />
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default TestimonialSection;
