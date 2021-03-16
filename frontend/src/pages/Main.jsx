import React from 'react';
import { Box, Center, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import MainTabs from '../components/MainTabs';

const Main = () => {
  return (
    <>
      <Navbar />
      <VStack spacing="0px">
        <Center
          h="300px"
          w="100%"
          borderBottom="1px"
          borderColor="main.green"
          bgImage="url(../img/main-background.jpg)"
        >
          <VStack>
            <HStack spacing="10px">
              <Heading color="main.white" size="2xl">
                Welcome to
              </Heading>
              <Heading color="main.green" size="3xl">
                ArtSai
              </Heading>
            </HStack>
            <Text w="800px" color="main.white" textAlign="center" fontSize="20px">
              ArtSai provides you with a simple, yet powerful way to show your portfolio and be seen by the right people
              in the industry. It's super fast and sleek. Showcase high resolution images to impress others. Add your
              work and production experience.
            </Text>
          </VStack>
        </Center>
        <Box h="40px" w="100%" bg="main.1" borderBottom="1px" borderColor="main.green">
          <MainTabs />
        </Box>
      </VStack>
    </>
  );
};

export default Main;
