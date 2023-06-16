import React from "react";
import { VStack } from "@chakra-ui/react";
import HeroSection from "../components/HeroSection";
import FeaturedProductsSection from "../components/FeaturedProductsSection";

function Home() {
  return (
    <VStack>
      <HeroSection />
      <FeaturedProductsSection />
    </VStack>
  );
}

export default Home;
