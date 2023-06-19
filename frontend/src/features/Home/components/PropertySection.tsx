import React from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Image,
  List,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import CandleImage from "../../../assets/images/home_property.png";
import Bullet from "../../../assets/images/checkmark-bullet.svg";

const PropertySection = () => {
  const properties = [
    {
      key: "Eco-sustainable",
      text: "All recyclable materials, 0% CO2 emissions",
    },
    {
      key: "Hyphoallergenic",
      text: "100% natural, human friendly ingredients.",
    },
    { key: "Handmade", text: "All candles are craftly made with love." },
    { key: "Long burning", text: "No more waste. Created for last long." },
  ];

  return (
    <Box w="full" bgColor="#F7F8FA">
      <Container maxW={{ base: "full", lg: "container.lg" }}>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          pt="120px"
          pb="45px"
          px={{ base: "15px", lg: "0px" }}
        >
          <VStack
            w={{ base: "full", lg: "auto" }}
            alignItems={{ base: "center", lg: "start" }}
            textAlign={{ base: "center", lg: "left" }}
          >
            <Heading
              w={{ base: "full", lg: "350px" }}
              fontSize="40px"
              fontWeight="medium"
            >
              Clean and fragrant soy wax
            </Heading>
            <Text color="primary">
              Made for your home and for your wellness
            </Text>
            <Box maxW="500px" mt="40px" px={["15px", "30px"]} hideFrom="lg">
              <Image
                src={CandleImage}
                dropShadow="xl"
                alt="Image of two candles"
              />
            </Box>
            <List
              mt="45px"
              px={{ base: "15px", md: 0 }}
              spacing="12px"
              textAlign="left"
            >
              {properties.map(({ key, text }, index) => (
                <ListItem key={index}>
                  <Image display="inline" src={Bullet} alt="List bullet" />
                  <Text ml="10px" as="b" display="inline">
                    {key}:
                  </Text>{" "}
                  <Text display="inline">{text}</Text>
                </ListItem>
              ))}
            </List>
            <Button w="195px" mt="40px">
              Learn more
            </Button>
          </VStack>
          <Image
            maxW="450px"
            src={CandleImage}
            dropShadow="xl"
            alt="Image of two candles"
            hideBelow="lg"
          />
        </HStack>
      </Container>
    </Box>
  );
};

export default PropertySection;
