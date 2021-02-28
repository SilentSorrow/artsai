import React from 'react';
import { Box, Center, Image, Tab, TabList, TabPanel, TabPanels, Tabs, VStack } from '@chakra-ui/react';
import Navbar from '../components/Navbar';

const Profile = () => {
  return (
    <>
      <Navbar />
      <VStack spacing="0px">
        <Center h="300px" w="100%" bg="blue">
          <Image
            borderRadius="full"
            boxSize="150px"
            src="https://sun9-19.userapi.com/impg/c857624/v857624916/17b7ce/gYKFJBlhRww.jpg?size=600x300&quality=96&sign=0afe9c9143d5e1a18cf2023644a0f3d8&type=album"
            fit="cover"
          />
        </Center>
        <Box h="40px" w="100%" bg="main.1">
          <Tabs h="100%" variant="unstyled" align="center" _focus={{ outline: 'none' }}>
            <TabList color="main.white">
              <Tab
                _selected={{ borderBottom: '2px', borderBottomColor: 'main.green', color: 'main.green' }}
                _focus={{ outline: 'none' }}
              >
                Portfolio
              </Tab>
              <Tab
                _selected={{ borderBottom: '2px', borderBottomColor: 'main.green', color: 'main.green' }}
                _focus={{ outline: 'none' }}
              >
                Following
              </Tab>
              <Tab
                _selected={{ borderBottom: '2px', borderBottomColor: 'main.green', color: 'main.green' }}
                _focus={{ outline: 'none' }}
              >
                Followers
              </Tab>
              <Tab
                _selected={{ borderBottom: '2px', borderBottomColor: 'main.green', color: 'main.green' }}
                _focus={{ outline: 'none' }}
              >
                Likes
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>Portfolio</TabPanel>
              <TabPanel>Following</TabPanel>
              <TabPanel>Followers</TabPanel>
              <TabPanel>Likes</TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </VStack>
    </>
  );
};

export default Profile;
