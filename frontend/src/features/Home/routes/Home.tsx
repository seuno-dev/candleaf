import React from "react";
import { VStack } from "@chakra-ui/react";
import HeroSection from "../components/HeroSection";
import FeaturedProductsSection from "../components/FeaturedProductsSection";
import PropertySection from "../components/PropertySection";

function Home() {
  return (
    <VStack>
      <HeroSection />
      <FeaturedProductsSection />
      <PropertySection />
    </VStack>
  );
}

export default Home;
