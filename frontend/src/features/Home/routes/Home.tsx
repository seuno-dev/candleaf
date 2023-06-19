import React from "react";
import { VStack } from "@chakra-ui/react";
import HeroSection from "../components/HeroSection";
import FeaturedProductsSection from "../components/FeaturedProductsSection";
import PropertySection from "../components/PropertySection";
import TestimonialSection from "../components/TestimonialSection";

function Home() {
  return (
    <VStack spacing={0}>
      <HeroSection />
      <FeaturedProductsSection />
      <PropertySection />
      <TestimonialSection />
    </VStack>
  );
}

export default Home;
